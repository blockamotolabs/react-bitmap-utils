export type HandlerNameToEventName<T extends string> = T extends `on${infer U}`
  ? Lowercase<U>
  : string;
