import { placeholder } from "../type/argument";

export class Argument {
  constructor() {
    this.#argumentQueue = [];
    this.#placeholderQueue = [];
    this.#takeCount = 0;
  }

  public apply(argument: unknown[]) {
    let i = 0;
    for (const x of argument) {
      if (x !== undefined && x !== null && placeholder in (x as any)) {
        this.#placeholderQueue.push(
          this.#takeCount + this.#argumentQueue.length
        );
        this.#argumentQueue.push(x);
      } else {
        if (0 < this.#placeholderQueue.length) {
          const index = this.#placeholderQueue.unshift();
          this.#argumentQueue[index - this.#takeCount] = x;
        } else {
          this.#argumentQueue.push(x);
        }
      }
    }
  }

  public tryTake(length: number): [true, unknown[]] | [false] {
    if (????) {
      this.#takeCount += length;
      return [true, this.#argumentQueue.splice(0, length)];
    } else {
      return [false];
    }
  }

  public takeAll(): unknown[] {
    return this.#argumentQueue;
  }

  #argumentQueue: unknown[];
  #placeholderQueue: number[];
  #takeCount: number;
}
