export interface Queue<T = unknown> {
  getHead: () => T | null;
  getTail: () => T | null;
  front: () => T | null;
  back: () => T | null;
  pushFront: (data: T) => void;
  pushBack: (data: T) => void;
  popFront: () => T | null;
  popBack: () => T | null;
  enqueue: (data: T) => void;
  dequeue: () => T | null;
  clear: () => void;
}

export interface QueueNode<T = unknown> {
  prev: QueueNode<T> | null;
  next: QueueNode<T> | null;
  data: T | null;
  clear: () => void;
}
