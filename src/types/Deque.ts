export interface Deque<T = unknown> {
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
  get: (index: number) => T | undefined;
  insert: (index: number, value: T) => number;
  remove: (value: T) => T | undefined;
  count: (value: T) => number;
  toArray: () => T[];
  reverse: () => Deque<T>;
  copy: () => Deque<T>;
  toString: () => string;
}

export interface DequeNode<T = unknown> {
  next: DequeNode<T> | null;
  prev: DequeNode<T> | null;
  data: T | undefined;
  clear: () => void;
}
