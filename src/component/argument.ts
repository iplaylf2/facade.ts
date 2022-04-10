import { placeholder } from "../type/argument";
import { LinkedList } from "../type/container";

export class Argument {
  constructor() {
    this.#argumentQueue = [];
    this.#placeholderDummy = { x: 0, next: null };
    this.#placeholderTail = null;
    this.#takeCount = 0;
  }

  apply(argument: unknown[]) {
    let last: LinkedList<number> | null = this.#placeholderDummy;
    let current = last.next;

    for (const x of argument) {
      if ("object" === typeof x && null !== x && placeholder in x) {
        if (null === current) {
          const node = {
            x: this.#takeCount + this.#argumentQueue.length,
            next: null,
          };

          this.#argumentQueue.push(x);

          if (null === this.#placeholderTail) {
            this.#placeholderDummy.next = node;
          } else {
            this.#placeholderTail.next = node;
          }

          this.#placeholderTail = node;
        }
      } else {
        if (null === current) {
          this.#argumentQueue.push(x);
        } else {
          this.#argumentQueue[current.x - this.#takeCount] = x;
          if (this.#placeholderTail === current) {
            this.#placeholderTail = null;
          }

          last.next = current.next;
          current = last;
        }
      }

      if (null !== current) {
        last = current;
        current = current.next;
      }
    }
  }

  tryTake(length: number): [true, unknown[]] | [false] {
    if (length <= this.#length()) {
      this.#takeCount += length;
      return [true, this.#argumentQueue.splice(0, length)];
    } else {
      return [false];
    }
  }

  takeAll(): unknown[] {
    return this.#argumentQueue;
  }

  #length(): number {
    if (null === this.#placeholderDummy.next) {
      return this.#argumentQueue.length;
    } else {
      return this.#placeholderDummy.next.x;
    }
  }

  #argumentQueue: unknown[];
  #placeholderDummy: LinkedList<number>;
  #placeholderTail: LinkedList<number> | null;
  #takeCount: number;
}
