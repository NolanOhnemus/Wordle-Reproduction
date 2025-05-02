export namespace Zods {
    export function readonly<R>(schema: Zod.Schema<R>): Zod.Schema<Readonly<R>> {
        return schema;
    }
}
