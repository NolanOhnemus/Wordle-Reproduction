export class Stack<T> implements ReadonlyStack<T> {
    private top: Node<T> | null = null;
    private size: number = 0;

    /**
     * The default constructor for the stack, can be initialized with or 
     * without elements already present
     * @param elements The elements to be initally added to the stack
     */
    constructor(...elements: T[]) {
        this.push(...elements);
    }

    /**
     * Adds one or more elements to the top of the stack and returns the new size
     * @param elements the elements to be put onto the top of the stack
     * @returns the size of the stack after the addition
     */
    push(...elements: T[]): number {
        for(const element of elements) {
            const node = new Node(element);
            node.previous = this.top;
            this.top = node;
            this.size++;
        }
        return this.length;
    }

    /**
     * Pops the top element off the stack removing it from the data structure
     * @returns the element that has been popped off the top of the stack
     */
    pop(): T | undefined {
        if(this.top === null) return undefined;

        const popped = this.top.element;
        this.top = this.top.previous;
        this.size--;
        return popped;
    }

    /**
     * Gets the last item added to the stack, returns undefined if nothing is present
     */
    get last(): T | undefined {
        return this.top?.element;
    }

    /**
     * Gets the size of the stack
     */
    get length(): number {
        return this.size;
    }

    /**
     * Gets a read only version of the stack
     * @returns a read only instance of the stack that cannot be changed
     */
    readonly(): ReadonlyStack<T> {
        return this;
    }
}

/**
 * Internal class for the elements with the stack represented as a Node.
 * The contents of the node cannot be altered once the node has been created.
 */
class Node<T> {
    previous: Node<T> | null = null;

    constructor(
        readonly element: T,
    ) {}
}

/**
 * exporter for the interface for use to make stacks
 */
export interface ReadonlyStack<T> {
    get last(): T | undefined;
    get length(): number;
    readonly(): ReadonlyStack<T>;
}
