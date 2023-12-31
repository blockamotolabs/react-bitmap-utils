/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReactNode } from 'react';
import Reconciler, { HostConfig } from 'react-reconciler';
import { DefaultEventPriority } from 'react-reconciler/constants';

import { AnyObject } from '../types';
import { CanvasElementType } from './types';

interface TextChild {
  type: 'text';
  text: string;
}

export interface CanvasChild {
  type: CanvasElementType;
  props: AnyObject;
  rendered: (TextChild | CanvasChild)[];
}

export interface Container {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  rendered: (TextChild | CanvasChild)[];
}

interface HostContext {}

const rootHostContext: HostContext = {};
const childHostContext = {};

const HOST_CONFIG: HostConfig<
  CanvasElementType,
  AnyObject,
  Container,
  CanvasChild,
  TextChild,
  never,
  never,
  CanvasChild | TextChild,
  HostContext,
  boolean,
  CanvasChild[],
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
  createInstance: (type, props, _rootContainer, _hostContext) => ({
    type,
    props,
    rendered: [],
  }),
  createTextInstance: (text, _rootContainer, _hostContext) => ({
    type: 'text',
    text,
  }),
  appendChildToContainer: (parent, child) => parent.rendered.push(child),
  appendChild: (parent, child) => parent.rendered.push(child),
  appendInitialChild: (parent, child) => parent.rendered.push(child),
  finalizeInitialChildren: () => false,
  prepareUpdate: (
    _instance,
    _type,
    _oldProps,
    _newProps,
    _rootContainer,
    _hostContext
  ) => true,
  commitUpdate: (instance, _updatePayload, _type, _oldProps, newProps) =>
    (instance.props = newProps),
  commitTextUpdate: (textInstance, _oldText, newText) =>
    (textInstance.text = newText),
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
  clearContainer: (container) => (container.rendered = []),
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
  render: (reactElement: ReactNode, canvas: HTMLCanvasElement) => {
    const container = CanvasReconciler.createContainer(
      { canvas, ctx: canvas.getContext('2d')!, rendered: [] },
      0,
      null,
      false,
      false,
      'canvas',
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
    ) as Container;

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
