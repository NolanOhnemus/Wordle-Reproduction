import { Interface } from "../../../types/Interface";
import { Iterators } from "../Iterators";
import { Stack, ReadonlyStack } from "./Stack";

export class Tower<T> implements ReadonlyTower<T>, Interface<Stack<T>>, Iterable<T> {
    private base: T;
    private floors: T[];

    constructor(base: T, ...floors: T[]) {
        this.base = base;
        this.floors = floors;
    }

    push(...elements: T[]): number {
        this.floors.push(...elements);
        return this.length;
    }

    pop(): T | undefined {
        return this.floors.pop();
    }

    get first(): T {
        return this.base;
    }

    set first(value: T) {
        this.set(0, value);
    }

    get last(): T {
        const lastFloor = this.floors.at(-1);
        return lastFloor ?? this.base;
    }

    set last(value: T) {
        this.set(this.length - 1, value);
    }

    get length(): number {
        return 1 + this.floors.length;
    }

    [Symbol.iterator](): IterableIterator<T> {
        const { base, floors } = this;

        function* iterate(): IterableIterator<T> {
            yield base;

            for(const floor of floors) {
                yield floor;
            }
        }

        return iterate();
    }

    at(index: 0): T;
    at(index: number): T | undefined;
    at(index: number): T | undefined {
        if(index < 0) return this.at(this.length + index);
        return index === 0 ? this.base : this.floors[index - 1];
    }

    set(index: number, value: T): void {
        if(index === 0) this.base = value;
        else this.floors[index - 1] = value;
    }

    /**
     *
     * @param sorter
     * @returns This list sorted in place
     */
    sort(sorter: (a: T, b: T) => number): this {
        let first = this.first;
        const sortedArray = [...this].sort((a, b) => {
            if(sorter(first, a) > 0) first = a;
            if(sorter(first, b) > 0) first = b;
            return sorter(a, b);
        });
        this.base = first;
        this.floors = sortedArray.slice(1);
        return this;
    }

    map<R>(mapper: (value: T, index: number, tower: Tower<T>) => R): Tower<R> {
        const mappedBase = mapper(this.base, 0, this);
        const mappedFloors = this.floors.map((value, i) => mapper(value, i + 1, this));
        return new Tower(mappedBase, ...mappedFloors);
    }

    includes(value: T): boolean {
        return this.base === value || this.floors.includes(value);
    }

    some(predicate: (value: T, index: number, tower: Tower<T>) => boolean): boolean {
        if(predicate(this.base, 0, this)) return true;

        for(const [floor, i] of Iterators.enumerate(this.floors)) {
            if(predicate(floor, i + 1, this)) return true;
        }

        return false;
    }

    copy(): Tower<T> {
        return new Tower(this.first, ...this.slice(1));
    }

    slice(start?: number, end?: number): T[] {
        return [...this].slice(start, end);
    }

    reduce(reducer: (accumulator: T, value: T, index: number, tower: this) => T): T;
    reduce<R>(reducer: (accumulator: R, value: T, index: number, tower: this) => R, initialAccumulator: R): R;
    reduce<R>(
        reducer: (accumulator: T | R, value: T, index: number, tower: this) => T | R,
        initialAccumulator?: R,
    ): T | R {
        let accumulator: T | R;
        if(initialAccumulator !== undefined) {
            accumulator = initialAccumulator;
            accumulator = reducer(accumulator, this.first, 0, this);
        } else {
            accumulator = this.first;
        }

        for(const [value, i] of Iterators.enumerate(this.floors, 1)) {
            accumulator = reducer(accumulator, value, i, this);
        }

        return accumulator;
    }

    vacate(): this {
        this.floors = [];
        return this;
    }

    renew(first: T): this {
        this.vacate();
        this.first = first;
        return this;
    }

    shuffle(): this {
        const shuffled = this
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);

        this.renew(shuffled.first);
        this.push(...shuffled.slice(1));
        return this;
    }

    readonly(): ReadonlyTower<T> {
        return this;
    }
}

export interface ReadonlyTower<T> extends ReadonlyStack<T> {
    at(index: number): T | undefined;
}
