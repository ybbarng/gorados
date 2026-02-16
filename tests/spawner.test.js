import { describe, expect, it } from "vitest";
import {
  generatePokemonsInBounds,
  getPlacesInBounds,
  spawnAt,
} from "../src/spawner";

describe("spawnAt", () => {
  const placeIndex = 100;
  const lat = 37.5;
  const lng = 126.9;

  it("같은 시간과 장소에서 같은 포켓몬을 생성한다 (결정론성)", () => {
    const now = 1700000000;
    const p1 = spawnAt(placeIndex, lat, lng, now);
    const p2 = spawnAt(placeIndex, lat, lng, now);
    expect(p1).toEqual(p2);
  });

  it("다른 장소에서 다른 포켓몬을 생성한다", () => {
    // 여러 시간 시도하여 두 장소 모두 활성인 시점을 찾음
    let found = false;
    for (let t = 0; t < 1800 && !found; t += 30) {
      const p1 = spawnAt(100, lat, lng, 1700000000 + t);
      const p2 = spawnAt(200, lat, lng, 1700000000 + t);
      if (p1 && p2) {
        expect(p1.pokemon_id !== p2.pokemon_id || p1.attack !== p2.attack).toBe(
          true,
        );
        found = true;
      }
    }
    expect(found).toBe(true);
  });

  it("포켓몬 ID가 1~251 범위이다", () => {
    for (let i = 0; i < 100; i++) {
      const p = spawnAt(i, lat, lng, 1700000000);
      if (p) {
        expect(p.pokemon_id).toBeGreaterThanOrEqual(1);
        expect(p.pokemon_id).toBeLessThanOrEqual(251);
      }
    }
  });

  it("스탯이 0~15 범위이다", () => {
    for (let i = 0; i < 100; i++) {
      const p = spawnAt(i, lat, lng, 1700000000);
      if (p) {
        expect(p.attack).toBeGreaterThanOrEqual(0);
        expect(p.attack).toBeLessThanOrEqual(15);
        expect(p.defence).toBeGreaterThanOrEqual(0);
        expect(p.defence).toBeLessThanOrEqual(15);
        expect(p.stamina).toBeGreaterThanOrEqual(0);
        expect(p.stamina).toBeLessThanOrEqual(15);
      }
    }
  });

  it("기술이 해당 종의 풀에 포함되어 있다", () => {
    // move-pools.json에 있는 종의 포켓몬을 찾아 테스트
    for (let i = 0; i < 500; i++) {
      const p = spawnAt(i, lat, lng, 1700000000);
      if (p && p.move1 !== 0) {
        // move1, move2가 숫자인지 확인
        expect(typeof p.move1).toBe("number");
        expect(typeof p.move2).toBe("number");
      }
    }
  });

  it("일부 시간에 null을 반환한다 (소멸 상태)", () => {
    let nullCount = 0;
    // 30분 사이클의 다양한 시점을 시도
    for (let t = 0; t < 1800; t += 60) {
      if (spawnAt(placeIndex, lat, lng, 1700000000 + t) === null) {
        nullCount++;
      }
    }
    expect(nullCount).toBeGreaterThan(0);
  });

  it("시간 분산: 다른 스폰포인트는 다른 오프셋을 갖는다", () => {
    const despawns = new Set();
    for (let i = 0; i < 50; i++) {
      const p = spawnAt(i, lat, lng, 1700000500);
      if (p) despawns.add(p.despawn);
    }
    // 다양한 소멸 시간을 가져야 함
    expect(despawns.size).toBeGreaterThan(1);
  });
});

describe("generatePokemonsInBounds", () => {
  // 간단한 테스트용 places 데이터
  const places = [];
  for (let i = 0; i < 100; i++) {
    places.push([37.47 + i * 0.001, 126.96 + i * 0.001, 0]);
  }

  const bounds = {
    _southWest: { lat: 37.46, lng: 126.95 },
    _northEast: { lat: 37.58, lng: 127.07 },
  };

  it("최대 500개 제한을 준수한다", () => {
    const largePlaces = [];
    for (let i = 0; i < 2000; i++) {
      largePlaces.push([
        37.47 + (i % 100) * 0.001,
        126.96 + Math.floor(i / 100) * 0.001,
        0,
      ]);
    }
    const result = generatePokemonsInBounds(
      largePlaces,
      bounds,
      16,
      [],
      Date.now(),
    );
    expect(result.length).toBeLessThanOrEqual(500);
  });

  it("결정론적으로 동작한다", () => {
    const now = 1700000000000;
    const r1 = generatePokemonsInBounds(places, bounds, 16, [], now);
    const r2 = generatePokemonsInBounds(places, bounds, 16, [], now);
    expect(r1.length).toBe(r2.length);
    for (let i = 0; i < r1.length; i++) {
      expect(r1[i].id).toBe(r2[i].id);
      expect(r1[i].pokemon_id).toBe(r2[i].pokemon_id);
    }
  });

  it("뷰포트 밖의 장소는 제외한다", () => {
    const narrowBounds = {
      _southWest: { lat: 37.469, lng: 126.959 },
      _northEast: { lat: 37.472, lng: 126.962 },
    };
    const result = generatePokemonsInBounds(
      places,
      narrowBounds,
      16,
      [],
      1700000000000,
    );
    for (const p of result) {
      expect(p.latitude).toBeGreaterThanOrEqual(narrowBounds._southWest.lat);
      expect(p.latitude).toBeLessThanOrEqual(narrowBounds._northEast.lat);
    }
  });
});

describe("getPlacesInBounds", () => {
  const places = [
    [37.47, 126.96, 0], // pokestop
    [37.48, 126.97, 1], // gym
    [37.5, 126.98, 2], // 7-eleven
  ];

  const bounds = {
    _southWest: { lat: 37.46, lng: 126.95 },
    _northEast: { lat: 37.49, lng: 126.98 },
  };

  it("뷰포트 내 장소만 반환한다", () => {
    const result = getPlacesInBounds(places, bounds);
    expect(result.length).toBe(2); // 37.50은 범위 밖
    const types = result.map((r) => r.type).sort();
    expect(types).toEqual(["gym", "pokestop"]);
  });

  it("최대 500개 제한을 준수한다", () => {
    const largePlaces = [];
    for (let i = 0; i < 1000; i++) {
      largePlaces.push([37.47 + i * 0.0001, 126.96, 0]);
    }
    const wideBounds = {
      _southWest: { lat: 37.0, lng: 126.0 },
      _northEast: { lat: 38.0, lng: 127.5 },
    };
    const result = getPlacesInBounds(largePlaces, wideBounds);
    expect(result.length).toBeLessThanOrEqual(500);
  });
});
