export interface Queue<T = unknown> {
  size: number;
  front: () => T | undefined;
  back: () => T | undefined;
  pushFront: (data: T) => number;
  popBack: () => T | undefined;
  enqueue: (data: T) => number;
  dequeue: () => T | undefined;
  clear: () => void;
  indexOf: (value: T) => number;
}

export interface Deque<T = unknown> extends Queue<T> {
  pushBack: (data: T) => number;
  popFront: () => T | undefined;
  toArray: () => T[];
  reverse: () => Deque<T>;
  copy: () => Deque<T>;
  get: (index: number) => T | undefined;
  insert: (index: number, value: T) => number;
  remove: (value: T) => T | undefined;
  count: (value: T) => number;
}

export interface DequeNode<T = unknown> {
  next: DequeNode<T> | null;
  prev: DequeNode<T> | null;
  data: T | undefined;
  clear: () => void;
}
