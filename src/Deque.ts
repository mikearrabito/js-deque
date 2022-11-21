import { Deque, DequeNode } from "./types/Deque";
const customInspectSymbol = Symbol.for("nodejs.util.inspect.custom");

export class DequeImpl<T> implements Deque<T> {
  private head: DequeNode<T> | null = null;
  private tail: DequeNode<T> | null = null;

  constructor(...initData: T[]) {
    for (let i = initData.length - 1; i >= 0; i--) {
      // enqueue in reverse order to preserve order
      // new Deqeque(1,2,3) => [1, 2, 3]
      // insert 3 first, then 2 in front, then 1 in front
      // first element dequeued will be 3, which is end of init list
      this.enqueue(initData[i]);
    }
  }

  front() {
    return this.getHead();
  }

  back() {
    return this.getTail();
  }

  enqueue(data: T) {
    return this.pushFront(data);
  }

  dequeue() {
    return this.popBack();
  }

  getHead() {
    return this.head?.data ?? null;
  }

  getTail() {
    return this.tail?.data ?? null;
  }

  pushFront(data: T) {
    const newNode = new DequeNodeImpl(data);
    newNode.next = this.head;
    if (this.head !== null) {
      this.head.prev = newNode;
    }
    this.head = newNode;
    if (this.tail === null) {
      this.tail = newNode;
    }
  }

  pushBack(data: T) {
    const newNode = new DequeNodeImpl(data);
    newNode.prev = this.tail;
    if (this.tail !== null) {
      this.tail.next = newNode;
    }
    this.tail = newNode;
    if (this.head === null) {
      this.head = newNode;
    }
  }

  popFront() {
    const head = this.head;
    if (head === null) {
      return null;
    }

    const nextNode = head.next;

    if (nextNode !== null) {
      nextNode.prev = null;
      this.head = nextNode;
    } else {
      this.head = null;
      this.tail = null;
    }

    const data = head.data;
    head.clear();
    return data;
  }

  popBack() {
    const tail = this.tail;
    if (tail === null) {
      return null;
    }

    const prevNode = tail.prev;

    if (prevNode !== null) {
      prevNode.next = null;
      this.tail = prevNode;
    } else {
      this.head = null;
      this.tail = null;
    }

    const data = tail.data;
    tail.clear();
    return data;
  }

  clear() {
    let cur = this.head;
    let prev = this.head;
    while (cur !== null) {
      cur = cur.next;
      prev?.clear();
      prev = cur;
    }
    this.head = null;
    this.tail = null;
  }

  toString() {
    let queueStr = "Deque: [ ";
    let cur = this.head;

    if (cur === null) {
      return "Deque: Deque is empty";
    }

    while (cur != null) {
      const val = cur.data;
      if (typeof val === "object" && val !== null) {
        queueStr += "object, ";
      } else {
        queueStr += String(val) + ", ";
      }
      cur = cur.next;
    }

    return queueStr.substring(0, queueStr.length - 2) + " ]";
  }

  [customInspectSymbol]() {
    return this.toString();
  }
}

class DequeNodeImpl<T> implements DequeNode<T> {
  private _prev: DequeNode<T> | null = null;
  private _next: DequeNode<T> | null = null;
  private _data: T | null;

  constructor(data: T) {
    this._data = data;
  }

  get data() {
    return this._data;
  }

  set data(newData: T | null) {
    this._data = newData;
  }

  get prev() {
    return this._prev;
  }

  set prev(newPrev: DequeNode<T> | null) {
    this._prev = newPrev;
  }

  get next() {
    return this._next;
  }

  set next(newNext: DequeNode<T> | null) {
    this._next = newNext;
  }

  clear() {
    this._prev = null;
    this._next = null;
    this._data = null;
  }
}
