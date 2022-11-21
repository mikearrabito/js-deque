import { describe } from "mocha";
import { expect } from "chai";
import { DequeImpl as Deque } from "../Deque";

let deque: Deque<number> | null;

beforeEach(() => {
  deque = null;
});

const genRandomNumbers = () => {
  return Array.from({ length: 10 }, () => Math.floor(Math.random() * 1000));
};

const shuffle = (array: unknown[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

describe("Deque Tests", function () {
  it("should initialize an empty Deque", () => {
    deque = new Deque();
    expect(deque).to.not.be.null;
  });
  it("should initialize deque with list of elements", () => {
    deque = new Deque(...genRandomNumbers());
  });
  it("enqueues and dequeues in correct order", () => {
    deque = new Deque();
    const randomNums = genRandomNumbers();
    for (const num of randomNums) {
      deque.enqueue(num);
    }
    for (let i = 0; i < randomNums.length; i++) {
      expect(deque.dequeue()).to.equal(randomNums[i]);
    }
    expect(deque.front()).to.be.undefined;
    expect(deque.back()).to.be.undefined;
  });
  it("pops correctly value from front", () => {
    const randomNums = genRandomNumbers();
    deque = new Deque(...randomNums);
    expect(deque.popFront()).to.equal(randomNums[0]);
    deque = new Deque();
    deque.pushFront(1);
    expect(deque.popFront()).to.equal(1);
  });
  it("pops correctly value from back", () => {
    const randomNums = genRandomNumbers();
    deque = new Deque(...randomNums);
    expect(deque.popBack()).to.equal(randomNums[randomNums.length - 1]);
    deque = new Deque();
    deque.pushBack(1);
    expect(deque.popBack()).to.equal(1);
  });
  it("pushes value to front", () => {
    const randomNums = genRandomNumbers();
    deque = new Deque(...randomNums);
    const randomNum = Math.random();
    deque.pushFront(randomNum);
    expect(deque.front()).to.equal(randomNum);
  });
  it("pushes value to back", () => {
    const randomNums = genRandomNumbers();
    deque = new Deque(...randomNums);
    const randomNum = Math.random();
    deque.pushBack(randomNum);
    expect(deque.back()).to.equal(randomNum);
  });
  it("pushes value to front and pops from front correctly", () => {
    const randomNums = genRandomNumbers();
    deque = new Deque(...randomNums);
    const randomNum = Math.random();
    deque.pushFront(randomNum);
    expect(deque.popFront()).to.equal(randomNum);
    expect(deque.front()).to.equal(randomNums[0]);
  });
  it("pushes value to back and pops from back correctly", () => {
    const randomNums = genRandomNumbers();
    deque = new Deque(...randomNums);
    const randomNum = Math.random();
    deque.pushBack(randomNum);
    expect(deque.popBack()).to.equal(randomNum);
    expect(deque.back()).to.equal(randomNums[randomNums.length - 1]);
  });
  it("clears deque", () => {
    deque = new Deque(...genRandomNumbers());
    deque.clear();
    expect(deque.front()).to.be.undefined;
    expect(deque.back()).to.be.undefined;
    expect(deque.popFront()).to.be.undefined;
    expect(deque.popBack()).to.be.undefined;
  });
  it("allows insertion after clearing", () => {
    deque = new Deque(...genRandomNumbers());
    deque.clear();
    expect(deque.front()).to.be.undefined;
    expect(deque.back()).to.be.undefined;
    expect(deque.popFront()).to.be.undefined;
    expect(deque.popBack()).to.be.undefined;

    const randomNum = Math.random();
    deque.pushBack(randomNum);
    expect(deque.front()).to.equal(randomNum);
    expect(deque.back()).to.equal(randomNum);

    const secondRandomNum = Math.random();
    deque.pushBack(secondRandomNum);
    expect(deque.front()).to.equal(randomNum);
    expect(deque.back()).to.equal(secondRandomNum);
  });
  it("updates pointers correctly for deque of size 1", () => {
    const initNums = genRandomNumbers().slice(0, 2);
    // init with 2 values
    deque = new Deque(...initNums);

    expect(deque.front()).to.equal(initNums[0]);
    expect(deque.back()).to.equal(initNums[1]);

    expect(deque.popBack()).to.equal(initNums[1]);

    // deque size 1, head and tail should be same
    expect(deque.front()).to.equal(initNums[0]);
    expect(deque.back()).to.equal(initNums[0]);

    const randomNum = Math.random();
    deque.pushBack(randomNum);
    expect(deque.front()).to.equal(initNums[0]);
    expect(deque.back()).to.equal(randomNum);
  });
  it("prints toString correctly", () => {
    deque = new Deque();
    expect(deque.toString()).to.contain("empty");
    deque.enqueue(1);
    deque.enqueue(2);
    deque.enqueue(3);
    expect(deque.toString())
      .to.contain("1")
      .and.to.contain("2")
      .and.to.contain("3");
  });
  it("determines if value is in deque", () => {
    const randomNums = genRandomNumbers();
    deque = new Deque(...randomNums);
    for (const num of randomNums) {
      expect(deque.has(num)).to.be.true;
    }
    expect(deque.has(-1)).to.be.false; // randomnums are always positive
  });
  it("converts to array", () => {
    const randomNums = genRandomNumbers();
    deque = new Deque(...randomNums);
    const dequeAsArray = deque.toArray();
    for (let i = 0; i < randomNums.length; i++) {
      expect(dequeAsArray[i]).to.equal(randomNums[i]);
    }
    deque.clear();
    const emptydequeArr = deque.toArray();
    expect(emptydequeArr.length).to.equal(0);
  });
  it("sets size correctly", () => {
    deque = new Deque();
    expect(deque.size).to.equal(0);
    const randomNums = genRandomNumbers();
    for (const num of randomNums) {
      deque.enqueue(num);
    }
    expect(deque.size).to.equal(randomNums.length);
    deque.clear();
    expect(deque.size).to.equal(0);
  });
  it("reverses", () => {
    const randomNums = genRandomNumbers();
    deque = new Deque(...randomNums);

    const randomNumsReversed = randomNums.slice().reverse();
    deque.reverse();

    const dequeAsArray = deque.toArray();
    for (let i = 0; i < randomNums.length; i++) {
      expect(dequeAsArray[i]).to.equal(randomNumsReversed[i]);
    }

    // insert at front and back to ensure head and tail ptrs correct
    deque.enqueue(1);
    expect(deque.size).to.equal(randomNums.length + 1);
    expect(deque.popFront()).to.equal(1);

    deque.pushBack(1);
    expect(deque.size).to.equal(randomNums.length + 1);
    expect(deque.popBack()).to.equal(1);

    expect(deque.back()).to.equal(
      randomNumsReversed[randomNumsReversed.length - 1]
    );
    expect(deque.front()).to.equal(randomNumsReversed[0]);

    // reversing back to original
    deque.reverse();
    const dequeArrAfterSecondReverse = deque.toArray();
    for (let i = 0; i < deque.size; i++) {
      expect(dequeArrAfterSecondReverse[i]).to.equal(randomNums[i]);
    }
  });
  it("copies", () => {
    const randomNums = genRandomNumbers();
    deque = new Deque(...randomNums);

    const copy = deque.copy();
    expect(copy.size).to.equal(deque.size);

    const copyArr = copy.toArray();
    const qArr = deque.toArray();
    for (let i = 0; i < deque.size; i++) {
      expect(copyArr[i]).to.equal(qArr[i]);
    }

    copy.dequeue();
    expect(copy.size).to.not.equal(deque.size);
  });
  it("finds indexOf correctly", () => {
    const nums = [0, 1, 2, 3, 4];
    deque = new Deque(...nums);
    for (let i = 0; i < 5; i++) {
      expect(deque.indexOf(nums[i])).to.equal(i);
    }
  });
  describe("Get", () => {
    it("gets from given index", () => {
      const randomNums = genRandomNumbers();
      deque = new Deque(...randomNums);
      for (let i = 0; i < randomNums.length; i++) {
        expect(deque.get(i)).to.equal(randomNums[i]);
      }
    });
    it("returns undefined for invalid index", () => {
      const randomNums = genRandomNumbers();
      deque = new Deque(...randomNums);
      expect(deque.get(-1)).to.be.undefined;
      expect(deque.get(randomNums.length)).to.be.undefined;
    });
  });

  it("counts elements", () => {
    const THREE_ZEROS = [0, 0, 0];
    const FOUR_ONES = [1, 1, 1, 1];
    const ONE_THREE = [3];
    const FOUR_FIVES = [5, 5, 5, 5];
    const nums = [...THREE_ZEROS, ...FOUR_ONES, ...ONE_THREE, ...FOUR_FIVES];
    shuffle(nums);
    deque = new Deque(...nums);
    expect(deque.count(0)).to.equal(3);
    expect(deque.count(1)).to.equal(4);
    expect(deque.count(2)).to.equal(0);
    expect(deque.count(3)).to.equal(1);
    expect(deque.count(4)).to.equal(0);
    expect(deque.count(5)).to.equal(4);
  });
  this.slow(1_000);
  it("handles many elements", () => {
    deque = new Deque();
    const NUM_ELEMENTS = 1_000_000;
    for (let i = 0; i < NUM_ELEMENTS; i++) {
      deque.enqueue(Math.random());
    }
    expect(deque.size).to.equal(NUM_ELEMENTS);
    for (let i = 0; i < NUM_ELEMENTS; i++) {
      deque.dequeue();
    }
    expect(deque.size).to.equal(0);
  });
  describe("Insert", function () {
    it("inserts at front", () => {
      const randomNums = genRandomNumbers();
      deque = new Deque(...randomNums);
      const INSERT_IDX = 0;
      const NUM_INSERTED = Math.random();
      expect(deque.insert(INSERT_IDX, NUM_INSERTED)).to.equal(
        randomNums.length + 1
      );
      expect(deque.get(INSERT_IDX)).to.equal(NUM_INSERTED);
      expect(deque.front()).to.equal(NUM_INSERTED);
    });
    it("inserts in middle", () => {
      const randomNums = genRandomNumbers();
      deque = new Deque(...randomNums);
      const INSERT_IDX = 3;
      const NUM_INSERTED = Math.random();
      expect(deque.insert(INSERT_IDX, NUM_INSERTED)).to.equal(
        randomNums.length + 1
      );
      expect(deque.get(INSERT_IDX)).to.equal(NUM_INSERTED);
    });
    it("inserts at back", () => {
      const randomNums = genRandomNumbers();
      deque = new Deque(...randomNums);
      const INSERT_IDX = randomNums.length;
      const NUM_INSERTED = Math.random();
      expect(deque.insert(INSERT_IDX, NUM_INSERTED)).to.equal(
        randomNums.length + 1
      );
      expect(deque.get(INSERT_IDX)).to.equal(NUM_INSERTED);
      expect(deque.back()).to.equal(NUM_INSERTED);
    });
    it("inserts into empty deque", () => {
      deque = new Deque();
      const INSERT_IDX = 0;
      const NUM_INSERTED = Math.random();
      expect(deque.insert(INSERT_IDX, NUM_INSERTED)).to.equal(1);
      expect(deque.get(INSERT_IDX)).to.equal(NUM_INSERTED);
    });
    it("inserts with out of bounds indices", () => {
      const randomNums = genRandomNumbers();
      deque = new Deque(...randomNums);
      const OOB_FRONT_IDX = -1;
      const OOB_BACK_IDX = randomNums.length + 100;
      const NUM_INSERTED = Math.random();
      expect(deque.insert(OOB_FRONT_IDX, NUM_INSERTED)).to.equal(
        randomNums.length + 1
      );
      expect(deque.popFront()).to.equal(NUM_INSERTED);
      expect(deque.insert(OOB_BACK_IDX, NUM_INSERTED)).to.equal(
        randomNums.length + 1
      );
      expect(deque.popBack()).to.equal(NUM_INSERTED);
    });
  });
  describe("Removal", function () {
    it("removes from front", () => {
      const nums = [0, 1, 2, 3, 4, 5];
      deque = new Deque(...nums);
      expect(deque.remove(0)).to.equal(0);
      expect(deque.size).to.equal(nums.length - 1);
    });
    it("removes from middle", () => {
      const nums = [0, 1, 2, 3, 4, 5];
      deque = new Deque(...nums);
      expect(deque.remove(3)).to.equal(3);
      expect(deque.size).to.equal(nums.length - 1);
    });
    it("removes from back", () => {
      const nums = [0, 1, 2, 3, 4, 5];
      deque = new Deque(...nums);
      expect(deque.remove(5)).to.equal(5);
      expect(deque.size).to.equal(nums.length - 1);
    });
    it("removes multiple values", () => {
      const nums = [0, 1, 2, 3, 4, 5];
      deque = new Deque(...nums);
      expect(deque.remove(3)).to.equal(3);
      expect(deque.size).to.equal(nums.length - 1);
      expect(deque.remove(0)).to.equal(0);
      expect(deque.size).to.equal(nums.length - 2);
      expect(deque.remove(4)).to.equal(4);
      expect(deque.size).to.equal(nums.length - 3);
    });
  });
});
