// <credit src="https://stackoverflow.com/questions/41879327/deepreadonly-object-typescript">

export type DeepReadonly<T> =
    T extends (infer R)[] ? ((() => R[]) extends (() => T) ? DeepReadonlyArray<R> : DeepReadonlyObject<T>) :
    T extends Function ? T :
    T extends object ? DeepReadonlyObject<T> :
    T;

interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}

type DeepReadonlyObject<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>;
};

// </credit>
