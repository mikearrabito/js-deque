import { Dequeue, DequeueNode } from "./types/Queue";
const customInspectSymbol = Symbol.for("nodejs.util.inspect.custom");

export class DequeueImpl<T> implements Dequeue<T> {
  private head: DequeueNode<T> | null = null;
  private tail: DequeueNode<T> | null = null;

  constructor(...initData: T[]) {
    let prev: DequeueNode<T> | null = null;

    for (let i = 0; i < initData.length; i++) {
      const newNode = new DequeueNodeImpl(initData[i]);
      newNode.prev = prev;
      if (i === 0) {
        this.head = newNode;
      }
      if (i > 0) {
        // null check not needed since i=0 iter should set
        (prev as DequeueNode<T>).next = newNode;
      }
      prev = newNode;
    }

    this.tail = prev;
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
    const newNode = new DequeueNodeImpl(data);
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
    const newNode = new DequeueNodeImpl(data);
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
    let queueStr = "Dequeue: [ ";
    let cur = this.head;

    if (cur === null) {
      return "Dequeue: Dequeue is empty";
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

class DequeueNodeImpl<T> implements DequeueNode<T> {
  private _prev: DequeueNode<T> | null = null;
  private _next: DequeueNode<T> | null = null;
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

  set prev(newPrev: DequeueNode<T> | null) {
    this._prev = newPrev;
  }

  get next() {
    return this._next;
  }

  set next(newNext: DequeueNode<T> | null) {
    this._next = newNext;
  }

  clear() {
    this._prev = null;
    this._next = null;
    this._data = null;
  }
}
