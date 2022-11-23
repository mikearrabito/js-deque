import { Deque, DequeNode } from "./types/Deque";
import cloneDeep from "lodash/cloneDeep";
import isEqual from "lodash/isEqual";
const customInspectSymbol = Symbol.for("nodejs.util.inspect.custom");

/**
 * Deque aka Double-ended queue\
 * O(1) get, insert, and delete for front and back elements
 */
export class DequeImpl<T> implements Deque<T> {
  private head: DequeNode<T> | null = null;
  private tail: DequeNode<T> | null = null;
  private _size: number = 0;

  /**
   * Initializes Deque with given variables
   *
   * @example
   * ```ts
   * let deque = new Deque(1, 2, 3);
   * deque.toString(); // Deque: [1, 2, 3]
   * deque = new Deque<number>();
   * deque.toString(); // Deque: Deque is empty
   * ```
   * Calling the constructor with an array will create a
   * Deque with a single element which is an array, if you wish
   * to create a Deque with the elements from the array either use
   * the spread operator(new Deque(...arr)) or use Deque.fromArray(arr)
   * @param initData values to initialize the deque with
   */
  constructor(...initData: T[]) {
    for (let i = 0, len = initData.length; i < len; i++) {
      const newNode = new DequeNodeImpl(initData[i]);
      newNode.prev = this.tail;
      if (this.tail !== null) {
        this.tail.next = newNode;
      }
      this.tail = newNode;
      if (this.head === null) {
        this.head = newNode;
      }
      this._size++;
    }
  }

  /**
   * Constructs a deque from an array of elements
   *
   * @example
   * ```ts
   * const deque = Deque.fromArray([1, 2, 3]);
   * deque.toString(); // Deque: [1, 2, 3]
   * ```
   * @param initData array of elements to create deque with
   */
  static fromArray<T extends any>(initData: T[]) {
    const deque = new DequeImpl<T>();
    for (let i = 0, len = initData.length; i < len; i++) {
      const newNode = new DequeNodeImpl(initData[i]);
      newNode.prev = deque.tail;
      if (deque.tail !== null) {
        deque.tail.next = newNode;
      }
      deque.tail = newNode;
      if (deque.head === null) {
        deque.head = newNode;
      }
      deque._size++;
    }
    return deque;
  }

  /**
   * Number of elements in the deque
   */
  get size() {
    return this._size;
  }

  /**
   * Returns value at the front, or undefined if none exists
   *
   * @returns value at front
   */
  front() {
    return this.head?.data ?? undefined;
  }

  /**
   * Returns value at the back, or undefined if none exists
   *
   * @returns value at back
   */
  back() {
    return this.tail?.data ?? undefined;
  }

  /**
   * Enqueues value by inserting at front
   *
   * @param data value to insert
   */
  enqueue(data: T) {
    return this.pushFront(data);
  }

  /**
   * dequeues value by removing from back
   *
   * @returns value at end or undefined if deque is empty
   */
  dequeue() {
    return this.popBack();
  }

  /**
   * Inserts value at front
   *
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
    return this._size;
  }

  /**
   * Inserts value at back
   *
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
    return this._size;
  }

  /**
   * Removes value from front, returns undefined if empty
   *
   * @returns value removed
   */
  popFront() {
    const head = this.head;
    if (head === null) {
      return undefined;
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
   * Removes value from end, returns undefined if empty
   *
   * @returns value removed
   */
  popBack() {
    const tail = this.tail;
    if (tail === null) {
      return undefined;
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

  private getNodeAtIndex(index: number): DequeNode<T> | undefined {
    if (index >= this.size || index < 0) {
      return undefined;
    }
    let curIdx = 0;
    let node = this.head;
    while (node !== null) {
      if (curIdx === index) {
        return node;
      }
      node = node.next;
      curIdx++;
    }
    return undefined;
  }

  private getNodeByValue(value: T): {
    node: DequeNode<T> | undefined;
    index: number;
  } {
    let index = 0;
    let node = this.head;
    while (node !== null) {
      if (isEqual(node.data, value)) {
        return { node, index };
      }
      index++;
      node = node.next;
    }
    return {
      node: undefined,
      index: -1,
    };
  }

  /**
   * Finds and returns value at given index
   *
   * @param index of item to retrieve
   * @returns item at index given, or undefined if invalid index given
   */
  get(index: number): T | undefined {
    return this.getNodeAtIndex(index)?.data;
  }

  /**
   * Inserts value at given index, if an out of bounds index is given then inserts
   * at front or back, depending on which direction the index is out of bounds
   *
   * @param index insertion index
   * @param value value to insert
   * @returns new size of the deque
   */
  insert(index: number, value: T): number {
    if (index <= 0) {
      return this.pushFront(value);
    }
    if (index >= this._size) {
      return this.pushBack(value);
    }

    // casting since we should always find node in middle of list, and
    // a node in the middle of the list will always have prev !== null
    const node = this.getNodeAtIndex(index) as DequeNode<T>;
    const prev = node.prev as DequeNode<T>;

    const newNode = new DequeNodeImpl(value);

    prev.next = newNode;
    node.prev = newNode;
    newNode.prev = prev;
    newNode.next = node;

    this._size++;
    return this._size;
  }

  /**
   * Removes first occurance of a value
   *
   * @param value value to remove
   * @returns value removed, or undefined if value not found
   */
  remove(value: T) {
    const { node } = this.getNodeByValue(value);
    let valRemoved: T | undefined;
    if (node !== undefined) {
      if (node === this.head) {
        valRemoved = this.popFront();
      } else if (node === this.tail) {
        valRemoved = this.popBack();
      } else {
        valRemoved = node.data;
        const next = node.next;
        const prev = node.prev;
        node.clear();
        (prev as DequeNode<T>).next = next;
        (next as DequeNode<T>).prev = prev;
        this._size--;
      }
    }
    return valRemoved;
  }

  /**
   * Counts number of elements that equal to the value given
   *
   * @param value value to search for
   * @returns number of occurances of value in the deque
   */
  count(value: T): number {
    let count = 0;
    let node = this.head;
    while (node !== null) {
      if (isEqual(node.data, value)) {
        count++;
      }
      node = node.next;
    }
    return count;
  }

  /**
   * Searches for a value and returns the first found index, or -1 if not found
   *
   * @param value value to search for
   * @returns index of value in the deque or -1 if not found
   */
  indexOf(value: T): number {
    return this.getNodeByValue(value).index;
  }

  /**
   * Determines if given value exists in the deque
   *
   * @param val value to search for
   * @returns true if value exists
   */
  has(val: T) {
    return this.indexOf(val) > -1;
  }

  /**
   * Returns a representation of the deque as an array, creates a deep copy of objects
   *
   * @returns array of values in order maintained in deque
   */
  toArray() {
    const arr = new Array<T>(this._size);
    let cur = this.head;
    for (let i = 0; i < this._size; i++) {
      const node = cur as DequeNode<T>; // cast since size > 0
      arr[i] = cloneDeep(node.data) as T;
      cur = cur?.next as DequeNode<T>; // will be null on last iter, but i will be == size
    }
    return arr;
  }

  /**
   * Reverses the deque in-place
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
   * Creates a copy of the deque maintaining order of values, creates a deep copy of objects
   *
   * @returns a new instance with copied values
   */
  copy() {
    return DequeImpl.fromArray(this.toArray());
  }

  toString() {
    let queueStr = "Deque: [ ";
    let cur = this.head;

    if (cur === null) {
      return "Deque: Deque is empty";
    }

    while (cur !== null) {
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
  private _data: T | undefined;

  constructor(data: T) {
    this._data = data;
  }

  get data() {
    return this._data;
  }

  set data(newData: T | undefined) {
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
    this._data = undefined;
  }
}
