# JS-Deque

Deque implementation in typescript/javascript.

# Interface

```ts
interface Deque<T = unknown> {
  size: number;
  front: () => T | undefined;
  back: () => T | undefined;
  pushFront: (data: T) => number;
  pushBack: (data: T) => number;
  popFront: () => T | undefined;
  popBack: () => T | undefined;
  enqueue: (data: T) => number;
  dequeue: () => T | undefined;
  push: (data: T) => number;
  pop: () => T | undefined;
  clear: () => void;
  indexOf: (value: T) => number;
  has: (value: T) => boolean;
  get: (index: number) => T | undefined;
  insert: (index: number, value: T) => number;
  remove: (value: T) => T | undefined;
  count: (value: T) => number;
  toArray: () => T[];
  reverse: () => Deque<T>;
  copy: () => Deque<T>;
  toString: () => string;
}
```

# Example Usage

```ts
import { Deque } from 'js-deque';

const values = [1, 2, 3];
let deque = new Deque(...values); // deque node element type will be inferred from array's member type
// or
deque = Deque.fromArray(values); // (deque: Deque<number>)

deque.popBack(); // 3
deque.popFront(); // 1
deque.has(2); // true
deque.size; // 1
deque.toString(); // [1]

deque.pushFront(1);
```

If initializing an empty deque make sure to pass in a type into the constructors generic, otherwise the type will be inferred as `unknown`

```ts
const deque = new Deque(); // Deque<unknown>
deque.push(1); // ts error: 'number is not assignable to unknown'

const deque = new Deque<number>();
deque.push(1);

const deque = new Deque<number | string>();
deque.push(1);
deque.push("a string");
```

## Usage as a queue

For usage as a queue(FIFO), `enqueue` and `dequeue` are provided as aliases to `pushFront` and `popBack` respectively.

```ts
const deque = new Deque<number>();
deque.enqueue(1); // [1]
deque.enqueue(2); // [2, 1]
deque.enqueue(3); // [3, 2, 1]
deque.dequeue(); // 1
deque.dequeue(); // 2
deque.dequeue(); // 3
```

## Usage as a stack

For usage as a stack(LIFO), `push` and `pop` are provided as aliases to `pushFront` and `popFront` respectively.

```ts
const deque = new Deque<number>();
deque.push(1); // [1]
deque.push(2); // [2, 1]
deque.push(3); // [3, 2, 1]
deque.pop(); // 3
deque.pop(); // 2
deque.pop(); // 1
```
