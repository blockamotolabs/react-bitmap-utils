/* eslint-disable @typescript-eslint/no-unused-vars */
import { Children, ReactElement, ReactNode, ReactPortal } from 'react';
import Reconciler, { HostConfig } from 'react-reconciler';
import { DefaultEventPriority } from 'react-reconciler/constants';

import {
  CanvasElementType,
  InternalCanvasElementType,
  ReconciledCanvasChild,
  ReconciledTextChild,
} from '../types';
import { AnyObject } from './types';

export interface Container {
  type: InternalCanvasElementType.Root;
  rendered: (string | ReconciledTextChild | ReconciledCanvasChild)[];
}

interface HostContext {}

const rootHostContext: HostContext = {};
const childHostContext = {};

const flattenChildren = (
  children: ReactNode
): readonly (
  | string
  | number
  | boolean
  | null
  | undefined
  | ReactElement
  | ReactPortal
)[] => {
  return Children.toArray(children).reduce<
    readonly (
      | string
      | number
      | boolean
      | null
      | undefined
      | ReactElement
      | ReactPortal
    )[]
  >((acc, child) => {
    if (!!child && typeof child === 'object') {
      if (Symbol.iterator in child) {
        return [...acc, ...flattenChildren(child)];
      }

      return [...acc, child, ...flattenChildren(child.props.children)];
    }

    return [...acc, child];
  }, []);
};

const getPropsExcludingChildrenHaveChanged = (
  oldProps: AnyObject,
  newProps: AnyObject
) => {
  const oldEntries = Object.entries(oldProps);
  const newEntries = Object.entries(newProps);

  if (oldEntries.length !== newEntries.length) {
    return true;
  }

  for (let i = 0; i < newEntries.length; i += 1) {
    const entry = newEntries[i];

    if (!entry) {
      continue;
    }

    const [key, value] = entry;

    if (key === 'children') {
      continue;
    }

    if (value !== oldProps[key]) {
      return true;
    }
  }
};

const UPDATE_CHECK_MAP: Record<
  string,
  (oldProps: AnyObject, newProps: AnyObject) => boolean
> = {
  [CanvasElementType.CanvasBuffer]: (oldProps, newProps) => {
    if (getPropsExcludingChildrenHaveChanged(oldProps, newProps)) {
      return true;
    }

    const oldChildren = flattenChildren(oldProps.children);
    const newChildren = flattenChildren(newProps.children);

    if (oldChildren.length !== newChildren.length) {
      return true;
    }

    for (let i = 0; i < newChildren.length; i += 1) {
      const oldChild = oldChildren[i];
      const newChild = newChildren[i];

      if (typeof oldChild !== typeof newChild) {
        return true;
      }

      if (
        (typeof oldChild !== 'object' || typeof newChild !== 'object') &&
        oldChild !== newChild
      ) {
        return true;
      }

      if (
        !!oldChild &&
        typeof oldChild === 'object' &&
        !!newChild &&
        typeof newChild === 'object' &&
        getPropsExcludingChildrenHaveChanged(oldChild.props, newChild.props)
      ) {
        return true;
      }
    }

    return false;
  },
};

const HOST_CONFIG: HostConfig<
  CanvasElementType,
  AnyObject,
  Container,
  ReconciledCanvasChild,
  ReconciledTextChild,
  never,
  never,
  ReconciledCanvasChild | ReconciledTextChild,
  HostContext,
  {
    hasUpdates: boolean;
  },
  ReconciledCanvasChild[],
  ReturnType<(typeof globalThis)['setTimeout']>,
  -1
> = {
  supportsMutation: true,
  supportsPersistence: false,
  supportsHydration: false,
  supportsMicrotasks: false,
  isPrimaryRenderer: false,
  noTimeout: -1,
  getRootHostContext: () => rootHostContext,
  getChildHostContext: () => childHostContext,
  prepareForCommit: () => null,
  resetAfterCommit: () => {},
  shouldSetTextContent: (_type, props) =>
    typeof props.children === 'string' || typeof props.children === 'number',
  createInstance: (type, props, _rootContainer, _hostContext) => {
    const rendered = [];

    if (HOST_CONFIG.shouldSetTextContent(type, props)) {
      rendered.push({
        type: InternalCanvasElementType.Text,
        rendered: props.children.toString(),
      } as const);
    }

    return {
      type,
      props,
      rendered,
      hasUpdates: true,
    };
  },
  createTextInstance: (text, _rootContainer, _hostContext) => ({
    type: InternalCanvasElementType.Text,
    rendered: text,
  }),
  insertBefore: (parent, child, beforeChild) => {
    const index = parent.rendered.indexOf(beforeChild);

    if (index >= 0) {
      parent.rendered.splice(index, 0, child);
    }
  },
  appendChildToContainer: (parent, child) => parent.rendered.push(child),
  appendChild: (parent, child) => parent.rendered.push(child),
  appendInitialChild: (parent, child) => parent.rendered.push(child),
  finalizeInitialChildren: () => false,
  prepareUpdate: (
    _instance,
    type,
    oldProps,
    newProps,
    _rootContainer,
    _hostContext
  ) => {
    const getShouldUpdate = UPDATE_CHECK_MAP[type];

    if (!getShouldUpdate) {
      return {
        hasUpdates: true,
      };
    }

    if (getShouldUpdate(oldProps, newProps)) {
      return {
        hasUpdates: true,
      };
    }

    return {
      hasUpdates: false,
    };
  },
  commitUpdate: (instance, updatePayload, type, _oldProps, newProps) => {
    instance.props = newProps;
    instance.hasUpdates = updatePayload.hasUpdates;

    if (HOST_CONFIG.shouldSetTextContent(type, newProps)) {
      instance.rendered = [
        {
          type: InternalCanvasElementType.Text,
          rendered: newProps.children.toString(),
        },
      ];
    }
  },
  commitTextUpdate: (textInstance, _oldText, newText) => {
    textInstance.rendered = newText;
  },
  getPublicInstance: (instance) => instance,
  preparePortalMount: () => {},
  scheduleTimeout: globalThis.setTimeout,
  cancelTimeout: globalThis.clearTimeout,
  getCurrentEventPriority: () => DefaultEventPriority,
  getInstanceFromNode: () => null,
  beforeActiveInstanceBlur: () => {},
  afterActiveInstanceBlur: () => {},
  prepareScopeUpdate: () => {},
  getInstanceFromScope: () => null,
  detachDeletedInstance: () => {},
  clearContainer: (container) => {
    container.rendered = [];
  },
  removeChildFromContainer: (container, child) => {
    const index = container.rendered.indexOf(child);

    if (index >= 0) {
      container.rendered.splice(index, 1);
    }
  },
  removeChild: (parent, child) => {
    const index = parent.rendered.indexOf(child);

    if (index >= 0) {
      parent.rendered.splice(index, 1);
    }
  },
};

const CanvasReconciler = Reconciler(HOST_CONFIG);

const CanvasReconcilerPublic = {
  render: (reactElement: ReactNode) => {
    const container = CanvasReconciler.createContainer(
      { type: InternalCanvasElementType.Root, rendered: [] },
      0,
      null,
      false,
      false,
      'Canvas',
      (error) => {
        if (
          globalThis.console &&
          typeof globalThis.console.error === 'function'
        ) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      },
      null
    ) as { containerInfo: Container };

    CanvasReconciler.updateContainer(reactElement, container, null, () => null);

    return {
      container,
      update: (nextReactElement: ReactNode) =>
        CanvasReconciler.updateContainer(
          nextReactElement,
          container,
          null,
          () => null
        ),
      unmount: () => CanvasReconciler.updateContainer(null, container, null),
    };
  },
};

export default CanvasReconcilerPublic;
