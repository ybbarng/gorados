import { describe, expect, it } from "vitest";
import { calculateIvPerfection, calculateIvRank } from "../src/iv-utils";

describe("calculateIvPerfection", () => {
  it("완벽한 개체치(15/15/15)는 100%를 반환한다", () => {
    expect(calculateIvPerfection(15, 15, 15)).toBe(100);
  });

  it("최저 개체치(0/0/0)는 0%를 반환한다", () => {
    expect(calculateIvPerfection(0, 0, 0)).toBe(0);
  });

  it("중간 개체치를 올바르게 계산한다", () => {
    const result = calculateIvPerfection(10, 10, 10);
    expect(result).toBeCloseTo(66.67, 1);
  });

  it("문자열 입력도 올바르게 처리한다", () => {
    expect(calculateIvPerfection("15", "15", "15")).toBe(100);
  });
});

describe("calculateIvRank", () => {
  it("100%는 SSS 등급이다", () => {
    expect(calculateIvRank(100)).toBe("SSS");
  });

  it("95%는 SS 등급이다", () => {
    expect(calculateIvRank(95)).toBe("SS");
  });

  it("90%는 S 등급이다", () => {
    expect(calculateIvRank(90)).toBe("S");
  });

  it("80%는 A 등급이다", () => {
    expect(calculateIvRank(80)).toBe("A");
  });

  it("60%는 B 등급이다", () => {
    expect(calculateIvRank(60)).toBe("B");
  });

  it("40%는 C 등급이다", () => {
    expect(calculateIvRank(40)).toBe("C");
  });

  it("0%는 D 등급이다", () => {
    expect(calculateIvRank(0)).toBe("D");
  });

  it("음수는 E 등급이다", () => {
    expect(calculateIvRank(-1)).toBe("E");
  });

  it("경계값(94.9%)은 S 등급이다", () => {
    expect(calculateIvRank(94.9)).toBe("S");
  });
});
