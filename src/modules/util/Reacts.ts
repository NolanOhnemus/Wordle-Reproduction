import { Iterables } from "./Maps";

export namespace Reacts {
    export function map<V>(iterable: Iterable<V>, mapper: (value: V) => JSX.Element): JSX.Element[] {
        return Iterables.map(
            iterable,
            mapper,
            new Array<JSX.Element>(),
            (arr, value) => arr.push(value),
        );
    }
}
