async function handleResponse<S extends Zod.Schema>(
    input: RequestInfo | URL,
    responsePromise: Promise<Response>,
    responseSchema?: S,
): Promise<Zod.output<S>> {
    const response = await responsePromise;
    if(!response.ok) throw new Error(response.statusText);

    if(!responseSchema) return;

    const json = await response.json();
    const parseResult = responseSchema.safeParse(json);
    if(!parseResult.success) throw new Error(`JSON was of the incorrect shape! (Input: ${input})`);

    return parseResult.data;
}

export namespace Fetches {
    export async function get<S extends Zod.Schema>(
        input: RequestInfo | URL,
        responseSchema: S,
    ): Promise<Zod.output<S>> {
        return handleResponse(
            input,
            fetch(input),
            responseSchema,
        );
    }

    export function post(
        input: RequestInfo | URL,
        value: unknown,
    ): Promise<void>
    export function post<S extends Zod.Schema>(
        input: RequestInfo | URL,
        value: unknown,
        responseSchema: S,
    ): Promise<Zod.output<S>>
    export function post<S extends Zod.Schema>(
        input: RequestInfo | URL,
        postValue: unknown,
        responseSchema?: S,
    ): Promise<Zod.output<S>> {
        return handleResponse(
            input,
            fetch(input, {
                method: 'POST',
                body: JSON.stringify(postValue),
                headers: {
                    "Content-Type": "application/json",
                },
            }),
            responseSchema,
        );
    }
}
