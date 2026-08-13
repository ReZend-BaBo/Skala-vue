# Vue Exercise - Weather Dashboard

Vue 3를 기반으로 Vue의 기본 문법부터 반응형 상태 관리, Pinia Store, Axios를 활용한 외부 API 연동, 외부 API를 활용한 기능 확장까지 단계적으로 실습한 날씨 대시보드 프로젝트입니다.

초기에는 Mock Data를 활용한 날씨 화면에서 출발했으며, 이후 Pinia를 통한 전역 상태 관리와 OpenWeatherMap API를 이용한 실시간 날씨 조회 기능을 추가했습니다. 또한 대기질 정보 및 지역 관광 정보를 외부 API를 통해 확장하고, Vuetify를 적용하여 외부 UI Library를 활용할 수 있도록 구성했습니다.

---

# 1. 프로젝트 개요

## 1.1 프로젝트 목적

Vue 3의 주요 문법과 기능을 단계적으로 실습하고, 최종적으로 실제 외부 API를 사용하는 날씨 대시보드 형태의 애플리케이션으로 확장하는 것을 목표로 했습니다.

초기 Mockup 구현에서 시작하여 실제 API 기반 애플리케이션으로 발전시키면서 다음과 같은 기술을 학습했습니다.

- Vue 3 반응형 데이터 관리
- `v-for`, `v-if`, `v-else-if`, `v-else`
- 이벤트 처리 및 이벤트 수식어
- `computed`, `watch`, `watchEffect`
- 컴포넌트 분리
- Vue Router
- Pinia를 이용한 전역 상태 관리
- Axios를 이용한 비동기 API 통신
- 외부 API 데이터 가공 및 화면 적용
- `localStorage`를 이용한 데이터 저장
- 주기적인 데이터 갱신
- 외부 UI Library 사용 준비 및 적용
- 서로 다른 외부 API를 결합한 기능 확장

---

# 2. 주요 기능

현재 프로젝트는 다음 기능을 제공합니다.

- 지역명 검색
- 검색한 지역의 실시간 날씨 조회
- 검색한 지역 정보 저장
- 저장된 지역 데이터 유지
- 5분마다 날씨 데이터 자동 갱신
- 3개 단위의 병렬 API 요청
- 날씨 상세 정보 조회
- 섭씨 / 화씨 단위 전환
- 대기질 정보 조회
- AQI, PM2.5, PM10 등의 대기질 정보 표시
- 대기질을 기반으로 한 생활용 마스크 안내
- OpenStreetMap 기반 주변 관광 정보 조회
- 로딩 상태 표시
- API 요청 실패 시 에러 처리
- 시장 현황 Mock Data 표시
- Vue Router를 활용한 화면 이동

---

# 3. 프로젝트 구조

```text
src/
├── assets/
│   └── exercise.css
│
├── components/
│   ├── exercise/
│   │   ├── BaseDashboardCard.vue
│   │   ├── SearchBar.vue
│   │   ├── WeatherCard.vue
│   │   ├── UnitToggler.vue
│   │   └── ...
│   │
│   └── library/
│       ├── AxiosJson.vue
│       └── AxiosWeather.vue
│
├── stores/
│   ├── configStore.js
│   └── marketStore.js
│
├── views/
│   ├── WeatherHomeView.vue
│   ├── WeatherDetailView.vue
│   ├── MarketView.vue
│   └── ...
│
├── ExerciseApp.vue
├── PracticeApp.vue
├── App.vue
├── main.js
└── router/
    └── index.js
```

### 주요 파일 역할

| 파일                    | 역할                                                     |
| ----------------------- | -------------------------------------------------------- |
| `App.vue`               | 애플리케이션 최상위 화면 및 RouterView 구성              |
| `main.js`               | Vue, Pinia, Router, Vuetify 초기화                       |
| `WeatherHomeView.vue`   | 지역 검색, 날씨 목록, 실시간 API 조회, 저장 및 자동 갱신 |
| `WeatherDetailView.vue` | 선택한 지역의 상세 날씨, 대기질, 관광 정보               |
| `WeatherCard.vue`       | 지역별 날씨 카드 UI                                      |
| `UnitToggler.vue`       | 섭씨/화씨 단위 전환 UI                                   |
| `configStore.js`        | 전역 환경 설정 및 단위 상태 관리                         |
| `MarketView.vue`        | 시장 현황 Mock Data 표시                                 |
| `marketStore.js`        | 시장 관련 상태 관리                                      |
| `AxiosJson.vue`         | Axios CRUD 실습                                          |
| `AxiosWeather.vue`      | OpenWeatherMap Axios 통신 검증                           |

---

# 4. Exercise 1 - Vue 기본 문법 및 이벤트 처리

초기 Weather Mockup은 실제 API 대신 화면 실습을 위한 Mock Data를 사용했습니다.

## 4.1 실습 내용

### `v-for`

날씨 데이터 배열을 반복하여 지역별 날씨 카드를 생성했습니다.

```vue
<div
  v-for="item in visibleWeatherList"
  :key="item.id"
>
```

이를 통해 배열 데이터를 기반으로 반복적인 UI를 생성하는 방법을 실습했습니다.

### `v-if`, `v-else-if`, `v-else`

현재 기온에 따라 날씨 상태를 다르게 표시했습니다.

초기 Mockup 기준:

| 온도                | 표시   |
| ------------------- | ------ |
| 30℃ 이상            | 열대야 |
| 27℃ 이상 ~ 30℃ 미만 | 더위   |
| 23℃ 이상 ~ 27℃ 미만 | 선선함 |
| 23℃ 미만            | 쌀쌀   |

### 입력값 처리

`v-model` 대신 `:value`와 `@input`을 사용하여 입력값을 직접 관리했습니다.

```vue
<input :value="inputValue" @input="inputValue = $event.target.value" @keyup.enter="searchCity" />
```

### 이벤트 처리

- `@click`
- `@keyup.enter`
- `@click.stop`

등을 사용하여 클릭, Enter 키 입력 및 이벤트 버블링 방지를 실습했습니다.

### 검색어 처리

`trim()`을 사용하여 검색어 앞뒤의 불필요한 공백을 제거했습니다.

```js
const cityName = inputValue.value.trim()
```

### `computed`

현재 화면에 표시할 데이터를 계산하기 위해 `computed`를 활용했습니다.

### `setInterval`

일정 시간마다 화면에 표시되는 Mock Data를 변경하는 기능을 구현하고 `onUnmounted()`에서 타이머를 정리했습니다.

```js
timer = setInterval(() => {
  currentPage.value = (currentPage.value + 1) % 4
}, 10000)

onUnmounted(() => {
  clearInterval(timer)
})
```

---

# 5. Exercise 2 - Component 및 Router 구성

기존 하나의 Mockup 화면에서 기능을 분리하여 여러 Vue 컴포넌트로 구성했습니다.

## 5.1 컴포넌트 분리

주요 기능을 다음과 같이 분리했습니다.

- `WeatherCard.vue`
- `SearchBar.vue`
- `BaseDashboardCard.vue`
- `UnitToggler.vue`
- `MarketView.vue`

컴포넌트 분리를 통해 화면 구조와 기능을 독립적으로 관리할 수 있도록 구성했습니다.

## 5.2 Vue Router

날씨 대시보드와 상세 화면을 Router를 통해 연결했습니다.

```text
/exercise4
/exercise4/about
```

또한 상세 날씨 화면으로 이동할 수 있도록 동적 경로를 활용했습니다.

```text
/weather/:cityId
```

---

# 6. Exercise 3 - Pinia 전역 상태 관리

Pinia를 사용하여 여러 컴포넌트에서 공유해야 하는 전역 상태를 관리했습니다.

## 6.1 `configStore.js`

날씨 단위 설정을 전역 상태로 관리했습니다.

주요 구성:

```text
state
→ unit

getter
→ unitSymbol

action
→ toggleUnit()
```

예를 들어:

```js
const unit = ref('celsius')
```

값을 기준으로 전체 애플리케이션에서 섭씨와 화씨 표시를 전환했습니다.

## 6.2 단위 변환

날씨 원본 데이터는 섭씨 기준으로 유지하고 화면 표시 시에만 화씨로 변환했습니다.

```js
if (configStore.unit === 'fahrenheit') {
  return Math.round((rawTemp * 9) / 5 + 32)
}
```

이 구조를 통해 메인 화면과 상세 화면에서 동일한 설정을 공유할 수 있도록 구현했습니다.

## 6.3 `UnitToggler.vue`

대시보드 상단에 단위 변경 UI를 배치하고 `configStore`의 전역 상태를 변경하도록 구현했습니다.

이를 통해 메인 날씨 카드와 상세 날씨 화면에서 동시에 섭씨/화씨 상태가 변경되도록 구성했습니다.

## 6.4 추가 Store

과제에서 요구한 추가 Store 활용을 위해 `marketStore.js`를 작성했습니다.

시장 현황 Mock Data를 Store에서 관리하고, `state`, `getter`, `action`을 활용하는 구조를 추가로 실습했습니다.

### 시장 현황 예시

- KOSPI
- KOSDAQ
- 원/달러
- NASDAQ

시장 데이터는 실습용 Mock Data로 구성했습니다.

---

# 7. Exercise 4 - Axios 및 OpenWeatherMap API

Axios를 사용하여 실제 외부 API를 호출하고 기존 Mock Data 기반의 날씨 화면을 실시간 날씨 데이터 기반으로 변경했습니다.

---

## 7.1 Axios 기본 실습

### `AxiosJson.vue`

JSONPlaceholder를 대상으로 Axios의 CRUD 동작을 실습했습니다.

- GET
- POST
- PUT
- DELETE

예:

```js
const response = await axios.get(BASE_URL)
```

이를 통해 Axios의 기본 요청 구조와 `response.data`를 활용한 응답 데이터 처리 방식을 익혔습니다.

---

## 7.2 OpenWeatherMap 통신 확인

### `AxiosWeather.vue`

OpenWeatherMap Current Weather API를 대상으로 실제 날씨 데이터를 조회했습니다.

```js
const response = await axios.get(URL)
weatherData.value = response.data
```

응답 데이터를 활용하여 다음 정보를 확인했습니다.

- 현재 기온
- 날씨 상태
- 습도
- 지역명

또한 다음 구조를 통해 비동기 상태를 관리했습니다.

```js
isLoading.value = true

try {
  ...
} catch (error) {
  ...
} finally {
  isLoading.value = false
}
```

---

# 8. 실시간 지역 검색 기능

기존의 고정된 Mock Data 대신 사용자가 원하는 지역을 직접 검색하여 날씨 정보를 가져오도록 변경했습니다.

## 8.1 지역 검색

OpenWeatherMap Geocoding API를 사용하여 지역명을 위도/경도로 변환합니다.

```text
지역명
↓
Geocoding API
↓
latitude / longitude
↓
Current Weather API
↓
실시간 날씨
```

검색 예시:

```text
부여
서울
부산
대전
```

검색 결과로 얻은 좌표를 이용하여 해당 지역의 현재 날씨를 조회합니다.

---

# 9. 검색 지역 저장

검색한 지역은 `localStorage`에 저장하도록 구현했습니다.

이를 통해 브라우저를 새로고침하더라도 이전에 검색했던 지역을 다시 불러올 수 있도록 구성했습니다.

```js
localStorage.setItem('weatherLocations', JSON.stringify(weatherList.value))
```

저장된 지역은 애플리케이션 실행 시 다시 불러오며 최신 날씨 데이터를 API를 통해 갱신합니다.

---

# 10. 3개 단위 병렬 API 요청

저장된 지역을 3개 단위로 나누어 `Promise.all()`을 사용하여 병렬 요청하도록 구현했습니다.

```js
const batch = weatherList.value.slice(i, i + 3)

await Promise.all(batch.map((city) => fetchSingleWeather(city)))
```

따라서 저장된 지역이 여러 개 있더라도 다음과 같이 처리됩니다.

```text
1 ~ 3번 지역
→ 동시에 요청

4 ~ 6번 지역
→ 동시에 요청

7 ~ 9번 지역
→ 동시에 요청
```

이를 통해 병렬 비동기 요청 방식과 API 호출량을 조절하는 방법을 실습했습니다.

---

# 11. 5분 주기 자동 갱신

저장된 지역의 실시간 날씨 데이터를 5분마다 자동으로 갱신하도록 구성했습니다.

```js
refreshTimer = setInterval(
  () => {
    refreshWeatherList()
  },
  5 * 60 * 1000,
)
```

컴포넌트가 제거될 때 `clearInterval()`을 사용하여 타이머를 정리합니다.

```js
onUnmounted(() => {
  clearInterval(refreshTimer)
})
```

이를 통해 실시간 데이터의 주기적인 갱신과 리소스 정리를 함께 실습했습니다.

---

# 12. 상세 날씨 정보

상세 페이지에서는 선택한 지역의 좌표를 이용하여 Current Weather API를 단건 요청합니다.

```text
WeatherCard
↓
상세보기
↓
/weather/:cityId
↓
저장된 lat / lon 확인
↓
OpenWeatherMap API
↓
상세 날씨 정보
```

현재 상세 화면에서 제공하는 정보:

- 현재 기온
- 체감 온도
- 날씨 상태
- 습도
- 기압
- 풍속
- 가시거리

---

# 13. 로딩 및 에러 처리

메인 화면과 상세 화면 모두 API 통신 상태를 관리합니다.

### 로딩 상태

```js
const isLoading = ref(false)
```

API 요청 중에는 사용자에게 데이터 로딩 상태를 안내합니다.

### 에러 처리

```js
try {
  ...
} catch (error) {
  ...
} finally {
  isLoading.value = false
}
```

API 요청 실패, 지역 검색 실패, 저장 데이터 오류 등을 화면에서 확인할 수 있도록 처리했습니다.

---

# 14. OpenWeatherMap 추가 API - Air Pollution

OpenWeatherMap의 Air Pollution API를 추가하여 현재 대기질 정보를 활용했습니다.

현재 날씨와 동일한 지역의 좌표를 기반으로 대기질 데이터를 요청합니다.

```text
lat / lon
↓
Air Pollution API
↓
AQI
PM2.5
PM10
CO
NO₂
O₃
```

상세 화면에서는 다음 정보를 제공합니다.

- AQI
- PM2.5
- PM10
- 주요 대기오염 물질
- 대기질 상태

이를 통해 하나의 외부 서비스에서 제공하는 서로 다른 API를 결합하여 애플리케이션 기능을 확장했습니다.

---

# 15. 대기질 기반 마스크 안내

Air Pollution API의 AQI를 기준으로 애플리케이션에서 생활 정보 형태의 안내를 추가했습니다.

현재 앱의 표시 기준:

| AQI | 표시          |
| --- | ------------- |
| 1   | 마스크 불필요 |
| 2   | 일반 마스크   |
| 3   | KF80 이상     |
| 4   | KF94          |
| 5   | KF94          |

이 기준은 OpenWeatherMap이 제공하는 공식 마스크 권고가 아니라 **본 프로젝트에서 대기질 데이터를 활용하기 위해 정의한 화면용 안내 기준**입니다.

---

# 16. 기타 외부 API - OpenStreetMap Overpass

OpenWeatherMap 외의 외부 API를 추가하기 위해 OpenStreetMap Overpass API를 활용했습니다.

별도의 API Key 없이 지역의 위도/경도를 기준으로 주변 관광 및 역사 관련 장소를 검색합니다.

```text
저장된 지역
↓
lat / lon
↓
OpenStreetMap Overpass API
↓
주변 관광 / 역사 관련 장소
↓
거리순 정렬
↓
최대 5개 표시
```

상세 화면에서는 다음과 같은 정보를 제공합니다.

- 관광 명소명
- 관광/역사 분류
- 지역으로부터의 거리
- OpenStreetMap 상세 페이지 링크

이를 통해 날씨 정보뿐 아니라 해당 지역의 부가적인 정보를 함께 제공하도록 애플리케이션을 확장했습니다.

---

# 17. 외부 UI Library - Vuetify

Vue 기반 외부 UI Library를 학습하기 위해 Vuetify를 프로젝트에 추가했습니다.

설치:

```bash
npm install vuetify @mdi/font
```

`main.js`에서 Vuetify를 등록하여 Vue 애플리케이션에서 외부 UI 컴포넌트를 사용할 수 있도록 구성했습니다.

현재 프로젝트에서는 이후 다음과 같은 UI 영역에 Vuetify를 적용할 수 있도록 환경을 구성했습니다.

- 검색 입력
- 버튼
- 카드
- 로딩 상태
- 알림 메시지
- 페이지네이션

기존 기능 로직과 UI 표현을 분리하여 외부 UI Library를 기존 Vue 애플리케이션에 적용하는 방식을 학습했습니다.

---

# 18. 주요 기술

| 기술                   | 사용 목적                |
| ---------------------- | ------------------------ |
| Vue 3                  | 프론트엔드 UI 구현       |
| JavaScript             | 상태 및 기능 로직        |
| Vue Router             | 페이지 및 상세 화면 이동 |
| Pinia                  | 전역 상태 관리           |
| Axios                  | 외부 API 통신            |
| OpenWeatherMap         | 현재 날씨 및 대기질      |
| OpenStreetMap Overpass | 주변 관광/역사 정보      |
| Vuetify                | 외부 UI Library          |
| localStorage           | 검색 지역 저장           |
| Vite                   | 프로젝트 개발 및 빌드    |

---

# 19. 주요 API 구조

## OpenWeatherMap Current Weather API

```text
지역 좌표
↓
현재 기온
현재 날씨
습도
기압
풍속
가시거리
```

## OpenWeatherMap Air Pollution API

```text
지역 좌표
↓
AQI
PM2.5
PM10
CO
NO₂
O₃
```

## OpenStreetMap Overpass API

```text
지역 좌표
↓
주변 tourism / historic 데이터
↓
관광 및 역사 관련 장소
```

---

# 20. 데이터 처리 흐름

전체적인 애플리케이션 데이터 흐름은 다음과 같습니다.

```text
사용자 지역 검색
        ↓
OpenWeatherMap Geocoding API
        ↓
위도 / 경도 획득
        ↓
localStorage 저장
        ↓
OpenWeatherMap Current Weather API
        ↓
실시간 날씨 표시
        ↓
상세보기
        ↓
┌───────────────────────────────┐
│ Current Weather API            │
│ Air Pollution API              │
│ OpenStreetMap Overpass API     │
└───────────────────────────────┘
        ↓
상세 날씨 + 대기질 + 지역 정보
```

---

# 21. Customization 정리

이번 프로젝트에서는 기본 실습 내용을 바탕으로 다음과 같은 개인별 Customization을 추가했습니다.

### 1. 날씨 단위 전환

Pinia Store를 이용하여 섭씨와 화씨를 전역으로 전환할 수 있도록 구현했습니다.

### 2. 검색 지역 저장

사용자가 검색한 지역을 `localStorage`에 저장하여 새로고침 이후에도 유지되도록 구현했습니다.

### 3. 실시간 날씨 데이터

기존 Mock Data 대신 OpenWeatherMap API를 통해 실제 날씨 데이터를 가져오도록 변경했습니다.

### 4. 자동 갱신

저장된 지역의 날씨 정보를 5분마다 자동으로 갱신하도록 구현했습니다.

### 5. 상세 날씨

각 지역의 상세 페이지를 구성하고 별도의 API 요청을 통해 상세 날씨를 조회하도록 구현했습니다.

### 6. 대기질 기능

OpenWeatherMap Air Pollution API를 추가하여 대기질과 AQI 정보를 제공하도록 확장했습니다.

### 7. 생활 안내

AQI 값을 기준으로 마스크 관련 생활 안내를 추가했습니다.

### 8. 지역 관광 정보

OpenStreetMap Overpass API를 활용하여 검색 지역 주변의 관광 및 역사 정보를 제공하도록 확장했습니다.

### 9. 외부 UI Library

Vuetify를 프로젝트에 추가하여 Vue 기본 UI와 외부 UI Library의 활용 방법을 실습했습니다.

### 10. 기존 Market 기능 유지

이전 실습에서 작성한 `MarketView.vue`, `marketStore.js`를 유지하여 이전 단원의 학습 결과물이 삭제되지 않도록 구성했습니다.

---

# 22. 학습 내용 및 고찰

이번 실습을 통해 Vue의 기본 문법을 단순히 정적인 화면 구현에 사용하는 것에서 벗어나 실제 외부 API와 연결된 애플리케이션으로 확장하는 과정을 경험했습니다.

초기에는 배열에 저장된 Mock Data를 화면에 출력하는 방식으로 구현했지만, 이후 Pinia를 통해 여러 컴포넌트에서 사용하는 상태를 전역적으로 관리하고 Axios를 통해 외부 API의 실제 데이터를 받아 화면에 반영하도록 개선했습니다.

특히 지역 검색 결과를 좌표로 변환한 뒤 현재 날씨, 대기질 등의 API를 연속적으로 활용하는 과정을 통해 API 응답 구조를 이해하고 필요한 데이터만 추출하여 기존 컴포넌트 구조에 맞게 가공하는 방법을 익혔습니다.

또한 API 요청 과정에서 로딩 상태와 예외 처리를 구현하면서 비동기 통신에서 사용자에게 현재 상태를 적절하게 전달하는 것이 중요하다는 점을 확인했습니다.

마지막으로 하나의 외부 API에만 의존하지 않고 OpenWeatherMap과 OpenStreetMap을 함께 활용하여 애플리케이션의 기능을 확장하면서, 외부 데이터를 단순히 출력하는 것이 아니라 기존 애플리케이션의 목적에 맞게 재구성하여 활용하는 방법을 실습했습니다.

---

# 23. 실행 방법

프로젝트 설치:

```bash
npm install
```

개발 서버 실행:

```bash
npm run dev
```

프로덕션 빌드:

```bash
npm run build
```

---
