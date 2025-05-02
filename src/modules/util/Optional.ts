interface OptionalLike<T> {
    orElse<F>(fallback: F): T | F;
    map<R>(mapper: (value: T) => R): OptionalLike<R>;
}

class PresentOptional<T> implements OptionalLike<T> {
    readonly isPresent = true;
    readonly isEmpty = false;

    constructor(
        readonly value: T,
    ) {}

    orElse(): T {
        return this.value;
    }

    map<R>(mapper: (value: T) => R): PresentOptional<R> {
        return new PresentOptional(mapper(this.value));
    }
}

class EmptyOptional<T> implements OptionalLike<T> {
    readonly isPresent = false;
    readonly isEmpty = true;

    orElse<F>(fallback: F): F {
        return fallback;
    }

    map(): this {
        return this;
    }
}

export type Optional<T> = PresentOptional<T> | EmptyOptional<T>;

export namespace Optional {
    export const EMPTY = new EmptyOptional();

    export function of<T>(value: T): PresentOptional<T> {
        return new PresentOptional(value);
    }
}
