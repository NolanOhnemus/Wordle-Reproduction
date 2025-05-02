import { Tower } from "./data-structure/Tower";

export namespace Random {
    export function float(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    export function int(min: number, max: number): number {
        return Math.floor(Math.random() * ((max + 1) - min) + min);
    }

    export function element<T>(tower: Tower<T>): T {
        return tower.copy().shuffle().first;
    }
}
