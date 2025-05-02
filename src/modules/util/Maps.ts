export namespace Iterables {
    export function map<V, R, C>(
        iterable: Iterable<V>,
        mapper: (value: V) => R,
        collection: C,
        collector: (collection: C, value: R) => void,
    ): C {
        for(const value of iterable) {
            collector(collection, mapper(value));
        }
        return collection;
    }
}
