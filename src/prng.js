// mulberry32: 시드 기반 32비트 PRNG
export function mulberry32(seed) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 두 정수를 하나의 32비트 시드로 결합
export function hashSeed(a, b) {
  let h = (a * 2654435761) ^ (b * 2246822519);
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h = Math.imul(h ^ (h >>> 13), 0x45d9f3b);
  return (h ^ (h >>> 16)) >>> 0;
}

// rng()로부터 [min, max) 범위의 정수 반환
export function randInt(rng, min, max) {
  return min + Math.floor(rng() * (max - min));
}

// rng()로부터 배열에서 랜덤 요소 선택
export function randChoice(rng, array) {
  return array[Math.floor(rng() * array.length)];
}
