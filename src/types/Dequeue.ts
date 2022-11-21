import { DequeueImpl } from "../Dequeue";

export interface Queue<T = any> {
  getHead: () => T | null;
  getTail: () => T | null;
  front: () => T | null;
  back: () => T | null;
  pushFront: (data: T) => void;
  popBack: () => T | null;
  enqueue: (data: T) => void;
  dequeue: () => T | null;
  clear: () => void;
}

export interface Dequeue<T = any> extends Queue<T> {
  pushBack: (data: T) => void;
  popFront: () => T | null;
}

export interface DequeueNode<T = any> {
  next: DequeueNode<T> | null;
  prev: DequeueNode<T> | null;
  data: T | null;
  clear: () => void;
}

export const isDequeue = <T = any>(val: unknown): val is Dequeue<T> => {
  return val instanceof DequeueImpl;
};
