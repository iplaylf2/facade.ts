export type NonUndefinedAble<T> = T extends undefined ? never : T;
export type IsAny<T> = 0 extends 1 & T ? true : false;