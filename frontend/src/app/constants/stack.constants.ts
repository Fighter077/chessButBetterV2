export class Stack {
    private items: any[] = [];
    private index: number = 0;
    constructor() {
    }
    hasNext(): boolean {
        return this.index < this.items.length;
    }
    pop(): string | undefined {
        return this.items[this.index++];
    }
    push(item: string): void {
        this.items.push(item);
    }
    peek(): string | undefined {
        return this.items[this.index];
    }
}