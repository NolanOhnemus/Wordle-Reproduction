import { ZodSchema } from "zod";
import { Optional } from "./Optional";
import { DeepReadonly } from "../../types/DeepReadonly";

export class LocalStorageItem<T> {
    constructor(
        private readonly key: string,
        private readonly schema: ZodSchema<T>,
    ) {}

    get(): Optional<T> {
        const json = localStorage.getItem(this.key);
        if(json === null) return Optional.EMPTY;

        const parsed = JSON.parse(json);
        const result = this.schema.safeParse(parsed);
        return result.success ? Optional.of(result.data) : Optional.EMPTY;
    }

    set(value: DeepReadonly<T>): void {
        const json = JSON.stringify(value);
        localStorage.setItem(this.key, json);
    }
}
