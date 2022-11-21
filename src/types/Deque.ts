import { DequeImpl } from "../Deque";

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

export interface Deque<T = any> extends Queue<T> {
  pushBack: (data: T) => void;
  popFront: () => T | null;
}

export interface DequeNode<T = any> {
  next: DequeNode<T> | null;
  prev: DequeNode<T> | null;
  data: T | null;
  clear: () => void;
}

export const isDeque = <T = any>(val: unknown): val is Deque<T> => {
  return val instanceof DequeImpl;
};
