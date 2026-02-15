# GORADOS

포켓몬고 실시간 위치 지도 서비스입니다. 서울 지역의 포켓몬 출현 위치, 포케스탑, 체육관 정보를 Mapbox 기반 지도 위에 표시합니다.

## 주요 기능

- **실시간 포켓몬 지도**: 포켓몬 출현 위치를 지도에 마커로 표시
- **포케스탑/체육관 표시**: 줌 레벨에 따라 주변 포케스탑과 체육관 표시
- **포켓몬 상세 정보**: 개체치(IV), 기술, 남은 시간 등 팝업으로 확인
- **포켓몬 필터**: 특정 포켓몬만 표시하도록 필터링
- **줌 레벨 기반 분류**: 줌 레벨에 따라 희귀도별 포켓몬 자동 필터링
- **외부 지도 연동**: 카카오맵, 구글맵으로 바로 길찾기
- **포켓몬 상성표**: 타입별 상성 정보 제공

## 기술 스택

- **Backend**: Node.js, Express, SQLite3
- **Frontend**: jQuery, Mapbox.js (Leaflet 기반)
- **Build**: Gulp, Browserify, Babel
- **Logging**: Winston (일별 로그 로테이션)

## 설치 및 실행

### 사전 요구사항

- Node.js
- [Mapbox](https://www.mapbox.com/) access token

### 설정

1. 의존성 설치:
   ```bash
   yarn install
   ```

2. 환경 변수 설정 - 프로젝트 루트에 `.env` 파일 생성:
   ```
   MAPBOX_ACCESS_TOKEN=your_mapbox_access_token
   ```

3. Mapbox token을 소스에 반영 후 프론트엔드 빌드:
   ```bash
   npx gulp
   ```

4. 서버 실행:
   ```bash
   node index.js
   ```

5. 브라우저에서 `http://localhost:12026` 접속

## 프로젝트 구조

```
gorados/
├── index.js              # Express 서버 (API 엔드포인트)
├── data.db               # SQLite DB (포케스탑/체육관/포켓몬 더미 데이터)
├── classification.json   # 줌 레벨별 포켓몬 분류 기준
├── gulpfile.js           # Gulp 빌드 설정
├── package.json
├── src/                  # 프론트엔드 소스
│   ├── map.js            # 메인 지도 로직
│   ├── pokemon.js        # 포켓몬 클래스 (IV 계산, 팝업 등)
│   ├── filter.js         # 포켓몬 필터 UI
│   ├── type-chart.js     # 상성표 UI
│   └── ...
├── app/                  # 정적 파일 (HTML, CSS, 빌드된 JS)
│   ├── index.html
│   ├── css/
│   └── js/
├── static/images/        # 포켓몬 아이콘, 장소 아이콘
└── log/                  # 서버 로그 (일별 로테이션)
```

## API 엔드포인트

| 엔드포인트 | 설명 | 주요 파라미터 |
|---|---|---|
| `GET /places.json` | 포케스탑/체육관 조회 | `min_latitude`, `max_latitude`, `min_longitude`, `max_longitude` |
| `GET /pokemons.json` | 포켓몬 목록 조회 | 위 좌표 + `zoom_level`, `filters` |
| `GET /pokemon.json` | 개별 포켓몬 조회 | `id` |

## 데이터

포트폴리오 시연용 더미 데이터가 포함되어 있습니다:
- **포케스탑/체육관**: 서울 지역 약 15,000개
- **포켓몬**: 서울 주요 지역 (강남, 홍대, 여의도 등) 약 2,000마리

## 브랜치

| 브랜치 | 설명 |
|---|---|
| `main` | 전시용 (고정 타임스탬프 + 더미 데이터) |
| `main-old` | 실시간 크롤링 서비스 연동 버전 |
| `feature/mapbox` | Mapbox 지도 구현 |
| `feature/pokemon` | 포켓몬 표시 기능 |
| `feature/sample-for-display` | 전시용 시간 설정 |

## 라이선스

MIT
