import { Deque, DequeNode } from "./types/Deque";
const customInspectSymbol = Symbol.for("nodejs.util.inspect.custom");

/**
 * Deque aka Double Ended Queue\
 * Supports LIFO and FIFO operations to use as queue or stack\
 * O(1) get, insert, and delete for front and back elements
 */
export class DequeImpl<T> implements Deque<T> {
  private head: DequeNode<T> | null = null;
  private tail: DequeNode<T> | null = null;

  /**
   * Initializes Deque with given variables
   * @example
   * ```ts
   * let deque = new Deque(1,2,3);
   * deque.toString(); // Deque: [1, 2, 3]
   * deque = new Deque<number>();
   * deque.toString(); // Deque: Deque is empty
   * ```
   * @param initData values to initialize Deque with
   */
  constructor(...initData: T[]) {
    for (let i = initData.length - 1; i >= 0; i--) {
      this.enqueue(initData[i]);
    }
  }

  /**
   * Returns value at the front, or null if none exists
   * @returns value at front
   */
  front() {
    return this.getHead();
  }

  /**
   * Returns value at the back, or null if none exists
   * @returns value at back
   */
  back() {
    return this.getTail();
  }

  /**
   * Enqueues value by inserting at front
   * @param data value to insert
   */
  enqueue(data: T) {
    return this.pushFront(data);
  }

  /**
   * Dequeues value by removing from back
   * @returns value at end or null if deque is empty
   */
  dequeue() {
    return this.popBack();
  }

  /**
   * Returns value at front or null if deque is empty
   * @returns value at front
   */
  getHead() {
    return this.head?.data ?? null;
  }

  /**
   * Returns value at back
   * @returns value at back or null if deque is empty
   */
  getTail() {
    return this.tail?.data ?? null;
  }

  /**
   * Inserts value at front
   * @param data value to insert
   */
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

  /**
   * Inserts value at back
   * @param data value to insert
   */
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

  /**
   * Removes value from front, returns null if deque is empty
   * @returns value removed
   */
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

  /**
   * Removes value from end, returns null if deque is empty
   * @returns value removed
   */
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

  /**
   * Removes all elements
   */
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
