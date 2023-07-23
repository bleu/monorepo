/* eslint-disable @typescript-eslint/ban-types */
export type GetDeepProp<T extends object, K extends string> = K extends keyof T
  ? T[K]
  : { [P in keyof T]: GetDeepProp<Extract<T[P], object>, K> }[keyof T];

export type ArrElement<ArrType> = ArrType extends readonly (infer ElementType)[]
  ? ElementType
  : never;
