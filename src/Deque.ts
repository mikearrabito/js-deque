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
    DequeImpl.createFromArray(initData, this);
  }

  /**
   * Constructs a Deque from an array of elements
   *
   * @example
   * ```ts
   * const deque = Deque.fromArray([1, 2, 3]);
   * deque.toString(); // Deque: [1, 2, 3]
   * ```
   * @param initData array of elements to create deque with
   */
  static fromArray<T>(initData: T[]): DequeImpl<T> {
    return DequeImpl.createFromArray(initData, new DequeImpl<T>());
  }

  private static createFromArray<T>(initData: T[], deque: DequeImpl<T>) {
    const len = initData.length;
    let size = 0;
    if (len > 0) {
      const newNode = new DequeNodeImpl(initData[0]);
      deque.head = newNode;
      deque.tail = newNode;
      size++;
    }
    for (; size < len; size++) {
      const newNode = new DequeNodeImpl(initData[size]);
      newNode.prev = deque.tail;
      (deque.tail as DequeNode<T>).next = newNode;
      deque.tail = newNode;
    }
    deque._size = size;
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
    return ++this._size;
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
    return ++this._size;
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

    if (head.next !== null) {
      head.next.prev = null;
      this.head = head.next;
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

    if (tail.prev !== null) {
      tail.prev.next = null;
      this.tail = tail.prev;
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
      (prev as DequeNode<T>).clear();
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
    for (
      let node = this.head, curIdx = 0;
      node !== null;
      node = node.next, curIdx++
    ) {
      if (curIdx === index) {
        return node;
      }
    }
    return undefined;
  }

  private getNodeByValue(value: T): {
    node: DequeNode<T> | undefined;
    index: number;
  } {
    for (
      let node = this.head, index = 0;
      node !== null;
      node = node.next, index++
    ) {
      if (isEqual(node.data, value)) {
        return { node, index };
      }
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

    return ++this._size;
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
    for (let node = this.head; node !== null; node = node.next) {
      if (isEqual(node.data, value)) {
        count++;
      }
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
   * @param value value to search for
   * @returns true if value exists
   */
  has(value: T) {
    return this.indexOf(value) > -1;
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
      cur = (cur as DequeNode<T>).next; // will be null on last iter, but i will be == size
    }
    return arr;
  }

  /**
   * Reverses the deque in-place
   */
  reverse() {
    const oldHead = this.head;
    let prev: DequeNode<T> | null = null;
    for (let cur = this.head; cur !== null; ) {
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
    const copy = new DequeImpl<T>();
    for (let cur = this.head; cur !== null; cur = cur.next) {
      copy.pushBack(cloneDeep(cur.data) as T);
    }
    return copy;
  }

  toString() {
    let queueStr = "Deque: [ ";
    let cur = this.head;

    if (cur === null) {
      return "Deque: Deque is empty";
    }

    for (; cur !== null; cur = cur.next) {
      const val = cur.data;
      if (typeof val === "object" && val !== null) {
        queueStr += "object, ";
      } else {
        queueStr += String(val) + ", ";
      }
    }

    return queueStr.substring(0, queueStr.length - 2) + " ]";
  }

  [customInspectSymbol]() {
    return this.toString();
  }
}

class DequeNodeImpl<T> implements DequeNode<T> {
  prev: DequeNode<T> | null = null;
  next: DequeNode<T> | null = null;

  constructor(public data: T | undefined) {}

  clear() {
    this.prev = null;
    this.next = null;
    this.data = undefined;
  }
}
