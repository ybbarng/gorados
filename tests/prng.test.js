import { describe, expect, it } from "vitest";
import { hashSeed, mulberry32, randChoice, randInt } from "../src/prng";

describe("mulberry32", () => {
  it("같은 시드에서 같은 시퀀스를 생성한다", () => {
    const rng1 = mulberry32(12345);
    const rng2 = mulberry32(12345);
    for (let i = 0; i < 100; i++) {
      expect(rng1()).toBe(rng2());
    }
  });

  it("다른 시드에서 다른 시퀀스를 생성한다", () => {
    const rng1 = mulberry32(12345);
    const rng2 = mulberry32(54321);
    let same = 0;
    for (let i = 0; i < 100; i++) {
      if (rng1() === rng2()) same++;
    }
    expect(same).toBeLessThan(5);
  });

  it("0~1 사이의 값을 반환한다", () => {
    const rng = mulberry32(42);
    for (let i = 0; i < 1000; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe("hashSeed", () => {
  it("같은 입력에서 같은 시드를 생성한다", () => {
    expect(hashSeed(100, 200)).toBe(hashSeed(100, 200));
  });

  it("다른 입력에서 다른 시드를 생성한다", () => {
    expect(hashSeed(100, 200)).not.toBe(hashSeed(200, 100));
  });

  it("32비트 양수를 반환한다", () => {
    const seed = hashSeed(999, 888);
    expect(seed).toBeGreaterThanOrEqual(0);
    expect(seed).toBeLessThanOrEqual(0xffffffff);
  });
});

describe("randInt", () => {
  it("[min, max) 범위의 정수를 반환한다", () => {
    const rng = mulberry32(42);
    for (let i = 0; i < 1000; i++) {
      const v = randInt(rng, 5, 10);
      expect(v).toBeGreaterThanOrEqual(5);
      expect(v).toBeLessThan(10);
      expect(Number.isInteger(v)).toBe(true);
    }
  });

  it("분포가 대략 균일하다", () => {
    const rng = mulberry32(42);
    const counts = [0, 0, 0, 0, 0];
    for (let i = 0; i < 5000; i++) {
      counts[randInt(rng, 0, 5)]++;
    }
    for (const c of counts) {
      expect(c).toBeGreaterThan(800);
      expect(c).toBeLessThan(1200);
    }
  });
});

describe("randChoice", () => {
  it("배열 내 요소를 반환한다", () => {
    const rng = mulberry32(42);
    const arr = ["a", "b", "c"];
    for (let i = 0; i < 100; i++) {
      expect(arr).toContain(randChoice(rng, arr));
    }
  });
});
