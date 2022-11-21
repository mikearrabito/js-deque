import { Deque, DequeNode } from "./types/Deque";
import cloneDeep from "lodash/cloneDeep";
import isEqual from "lodash/isEqual";
const customInspectSymbol = Symbol.for("nodejs.util.inspect.custom");

/**
 * Deque aka Double Ended Queue\
 * Supports LIFO and FIFO operations to use as queue or stack\
 * O(1) get, insert, and delete for front and back elements
 */
export class DequeImpl<T> implements Deque<T> {
  private head: DequeNode<T> | null = null;
  private tail: DequeNode<T> | null = null;
  private _size: number = 0;

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
    this._size = initData.length;
  }

  /**
   * Number of elements in the Deque
   */
  get size() {
    return this._size;
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
   * @returns size after insertion
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
    this._size++;
    return this.size;
  }

  /**
   * Inserts value at back
   * @param data value to insert
   * @returns size after insertion
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
    this._size++;
    return this.size;
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
    this._size--;
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
    this._size--;
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
    this._size = 0;
  }

  /**
   * Determines if given value exists
   * @param val value to search for
   * @returns true if value exists in deque
   */
  has(val: T) {
    for (const node of this.getNodes()) {
      if (isEqual(node.data, val)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Returns a representation of the Deque as an array
   * @returns Deque as an array
   */
  toArray() {
    return [...this.getNodes()].map(node => node.data) as T[];
  }

  /**
   * Reverses the Deque in-place
   */
  reverse() {
    const oldHead = this.head;
    let cur = this.head;
    let prev: DequeNode<T> | null = null;
    while (cur !== null) {
      let next = cur.next;
      cur.next = cur.prev;
      cur.prev = next;
      prev = cur;
      cur = next;
    }
    this.head = prev;
    this.tail = oldHead;
    return this;
  }

  /**
   * Creates a copy of the Deque maintaining order of values, creates a deep copy of objects
   * @returns a new instance with copied values
   */
  copy() {
    return new DequeImpl(...this.toArray().map(v => cloneDeep(v)));
  }

  /**
   * Searches Deque for a value and returns index in queue, or -1 if not found
   * @param value value to search for
   * @returns index of value in queue or -1 if not found
   */
  indexOf(value: T): number {
    let index = 0;
    for (const node of this.getNodes()) {
      if (isEqual(node.data, value)) {
        return index;
      }
      index++;
    }
    return -1;
  }

  private *getNodes(): Generator<DequeNode<T>> {
    let cur = this.head;
    while (cur !== null) {
      yield cur;
      cur = cur.next;
    }
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
