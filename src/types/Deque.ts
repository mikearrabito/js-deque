import { DequeImpl } from "../Deque";

export interface Queue<T = any> {
  size: number;
  front: () => T | null;
  back: () => T | null;
  pushFront: (data: T) => number;
  popBack: () => T | null;
  enqueue: (data: T) => number;
  dequeue: () => T | null;
  clear: () => void;
  indexOf: (value: T) => number;
}

export interface Deque<T = any> extends Queue<T> {
  pushBack: (data: T) => number;
  popFront: () => T | null;
  toArray: () => T[];
  reverse: () => Deque<T>;
  copy: () => Deque<T>;
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
