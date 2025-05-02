export namespace Iterators {
    export function range(end: number): IterableIterator<number>;
    export function range(start: number, end: number, step?: number): IterableIterator<number>;
    export function* range(start: number, end?: number, step = 1): IterableIterator<number> {
        const startNumber = end === undefined ? 0 : start;
        const endNumber = end === undefined ? start : end;

        for(let i = startNumber; step > 0 ? i < endNumber : i > endNumber; i += step) {
            yield i;
        }
    }

    export function* enumerate<T>(
        iterable: Iterable<T>,
        startIndex: number = 0,
        indexStep: number = 1,
    ): IterableIterator<[T, number]> {
        let index = startIndex;
        for(const next of iterable) {
            yield [next, index];
            index += indexStep;
        }
    }

    // inspired by: https://dev.to/chrismilson/zip-iterator-in-typescript-ldm
    type Iterableify<T> = { [K in keyof T]: Iterable<T[K]> }

    export function* zip<A extends any[]>(...iterables: Iterableify<A>): IterableIterator<A> {
        const iters = iterables.map(i => i[Symbol.iterator]());

        generator: while(true) {
            const results = iters.map(iter => iter.next());

            const values = [];
            for(const result of results) {
                if(result.done === true) break generator;
                values.push(result.value);
            }

            yield values as A;
        }
    }

    export function* limit<T>(iterable: Iterable<T>, limit: number): IterableIterator<T> {
        const iterator = iterable[Symbol.iterator]();
        for(let i = 0; i < limit; i++) {
            const next = iterator.next();
            if(next.done === true) return next.value;
            yield next.value;
        }
    }
}
