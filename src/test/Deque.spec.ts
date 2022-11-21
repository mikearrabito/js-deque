import { describe } from "mocha";
import { expect } from "chai";
import { DequeImpl as Deque } from "../Deque";

let queue: Deque<number> | null;

beforeEach(() => {
  queue = null;
});

const genRandomNumbers = () => {
  return Array.from({ length: 10 }, () => Math.floor(Math.random() * 1000));
};

describe("Deque Tests", () => {
  it("should initialize an empty Deque", () => {
    queue = new Deque();
    expect(queue).to.not.be.null;
  });
  it("should initialize queue with list of elements", () => {
    queue = new Deque(...genRandomNumbers());
  });
  it("should enqueue and Deque in correct order", () => {
    queue = new Deque();
    const randomNums = genRandomNumbers();
    for (const num of randomNums) {
      queue.enqueue(num);
    }
    for (let i = 0; i < randomNums.length; i++) {
      expect(queue.dequeue()).to.equal(randomNums[i]);
    }
    expect(queue.getHead()).to.be.null;
    expect(queue.getTail()).to.be.null;
  });
  it("should pop correct value from front", () => {
    const randomNums = genRandomNumbers();
    queue = new Deque(...randomNums);
    expect(queue.popFront()).to.equal(randomNums[0]);
  });
  it("should pop correct value from back", () => {
    const randomNums = genRandomNumbers();
    queue = new Deque(...randomNums);
    expect(queue.popBack()).to.equal(randomNums[randomNums.length - 1]);
  });
  it("should push value to front", () => {
    const randomNums = genRandomNumbers();
    queue = new Deque(...randomNums);
    const randomNum = Math.random();
    queue.pushFront(randomNum);
    expect(queue.front()).to.equal(randomNum);
  });
  it("should push value to back", () => {
    const randomNums = genRandomNumbers();
    queue = new Deque(...randomNums);
    const randomNum = Math.random();
    queue.pushBack(randomNum);
    expect(queue.back()).to.equal(randomNum);
  });
  it("should push value to front and pop from front correctly", () => {
    const randomNums = genRandomNumbers();
    queue = new Deque(...randomNums);
    const randomNum = Math.random();
    queue.pushFront(randomNum);
    expect(queue.popFront()).to.equal(randomNum);
    expect(queue.front()).to.equal(randomNums[0]);
  });
  it("should push value to back and pop from back correctly", () => {
    const randomNums = genRandomNumbers();
    queue = new Deque(...randomNums);
    const randomNum = Math.random();
    queue.pushBack(randomNum);
    expect(queue.popBack()).to.equal(randomNum);
    expect(queue.back()).to.equal(randomNums[randomNums.length - 1]);
  });
  it("should clear queue", () => {
    queue = new Deque(...genRandomNumbers());
    queue.clear();
    expect(queue.front()).to.be.null;
    expect(queue.back()).to.be.null;
    expect(queue.popFront()).to.be.null;
    expect(queue.popBack()).to.be.null;
  });
  it("should allow insertion after clearing", () => {
    queue = new Deque(...genRandomNumbers());
    queue.clear();
    expect(queue.front()).to.be.null;
    expect(queue.back()).to.be.null;
    expect(queue.popFront()).to.be.null;
    expect(queue.popBack()).to.be.null;

    const randomNum = Math.random();
    queue.pushBack(randomNum);
    expect(queue.front()).to.equal(randomNum);
    expect(queue.back()).to.equal(randomNum);

    const secondRandomNum = Math.random();
    queue.pushBack(secondRandomNum);
    expect(queue.front()).to.equal(randomNum);
    expect(queue.back()).to.equal(secondRandomNum);
  });
  it("should update pointers correctly for queue of size 1", () => {
    const initNums = genRandomNumbers().slice(0, 2);
    // init with 2 values
    queue = new Deque(...initNums);

    expect(queue.front()).to.equal(initNums[0]);
    expect(queue.back()).to.equal(initNums[1]);

    expect(queue.popBack()).to.equal(initNums[1]);

    // queue size 1, head and tail should be same
    expect(queue.front()).to.equal(initNums[0]);
    expect(queue.back()).to.equal(initNums[0]);

    const randomNum = Math.random();
    queue.pushBack(randomNum);
    expect(queue.front()).to.equal(initNums[0]);
    expect(queue.back()).to.equal(randomNum);
  });
  it("should print toString correctly", () => {
    queue = new Deque();
    expect(queue.toString()).to.contain("empty");
    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);
    expect(queue.toString())
      .to.contain("1")
      .and.to.contain("2")
      .and.to.contain("3");
  });
});
