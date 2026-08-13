# Vue Exercise - Weather Mockup

Vue 3의 주요 디렉티브와 이벤트 처리 방식을 실습하기 위한 Weather Mockup 프로젝트입니다.

날씨 데이터를 활용하여 `v-for`, `v-if`, `:value`, `@input`, `@keyup.enter`, `@click`, `@click.stop` 등의 Vue 문법과 이벤트 처리 방식을 하나의 컴포넌트에서 직접 구현하고 동작을 확인했습니다.

---

## 1. Exercise 목표

Vue의 기본 문법과 반응형 데이터 처리 및 이벤트 처리 방식을 실습합니다.

주요 실습 내용:

* `v-for`를 활용한 목록 렌더링
* `:key`를 활용한 각 데이터의 고유 식별
* `v-if`, `v-else-if`, `v-else`를 활용한 조건부 렌더링
* `:value`와 `@input`을 활용한 입력값 처리
* `@keyup.enter`를 활용한 Enter 키 이벤트 처리
* `@click`을 활용한 클릭 이벤트 처리
* `@click.stop`을 활용한 이벤트 버블링 방지
* `trim()`을 활용한 검색어 앞뒤 공백 처리
* `setInterval`을 활용한 주기적인 화면 변경
* `computed`를 활용한 화면에 표시할 데이터 계산

---

## 2. 프로젝트 구조

```text
src/
├── assets/
│   └── exercise.css
│
├── components/
│   └── exercise/
│       └── WeatherMockup.vue
│
├── ExerciseApp.vue
├── PracticeApp.vue
├── App.vue
└── main.js
```

### 주요 파일

| 파일                  | 역할                                    |
| ------------------- | ------------------------------------- |
| `ExerciseApp.vue`   | Exercise 화면 구성                        |
| `WeatherMockup.vue` | 날씨 데이터, 검색, 목록 렌더링, 이벤트 처리 등 전체 기능 구현 |
| `exercise.css`      | Exercise 화면 스타일 관리                    |

기존에는 기능별로 여러 Vue 컴포넌트를 분리하여 구성했지만, Mockup 과제에서는 관련 기능을 하나의 `WeatherMockup.vue` 파일에서 관리하도록 구성했습니다.

---

## 3. 날씨 데이터

지역별 날씨 데이터는 `WeatherMockup.vue` 내부에서 `ref()`를 사용하여 관리합니다.

```js
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 30, status: '맑음', humidity: 65 },
  { id: 'city_02', name: '인천', temp: 29, status: '맑음', humidity: 68 },
  ...
])
```

각 데이터에는 다음과 같은 정보가 포함됩니다.

* `id` : 도시의 고유 식별자
* `name` : 도시 이름
* `temp` : 현재 기온
* `status` : 현재 날씨 상태
* `humidity` : 습도

날씨 데이터를 하나의 배열로 관리하고 `v-for`를 이용하여 각 지역을 카드 형태로 출력합니다.

---

## 4. v-for 목록 렌더링

날씨 데이터 배열을 `v-for`를 사용하여 날씨 카드 목록으로 출력합니다.

```vue
<div
  v-for="item in visibleWeatherList"
  :key="item.id"
  class="weather-card"
>
```

각 날씨 데이터가 하나의 카드로 생성되며, `:key`를 통해 각각의 데이터를 고유하게 식별합니다.

또한 `computed`를 활용하여 현재 화면에 표시할 4개의 데이터를 계산합니다.

```js
const visibleWeatherList = computed(() => {
  const sortedList = [...weatherList.value].sort((a, b) => {
    const numA = Number(a.id.replace('city_', ''))
    const numB = Number(b.id.replace('city_', ''))

    return numA - numB
  })

  const start = currentPage.value * 4

  return sortedList.slice(start, start + 4)
})
```

이를 통해 전체 지역을 한 번에 출력하지 않고 4개씩 나누어 화면에 표시합니다.

---

## 4-1. 날씨 카드 자동 변경

전체 날씨 데이터를 4개씩 묶어서 표시하고, `setInterval`을 사용하여 일정 시간마다 다음 지역으로 변경합니다.

```js
timer = setInterval(() => {
  currentPage.value = (currentPage.value + 1) % 4
}, 10000)
```

현재 설정된 변경 주기는 **10초**입니다.

`currentPage` 값이 변경되면 `computed`로 정의된 `visibleWeatherList`도 자동으로 다시 계산되어 다음 4개의 날씨 카드가 화면에 표시됩니다.

컴포넌트가 제거될 때에는 `clearInterval()`을 사용하여 타이머를 종료합니다.

```js
onUnmounted(() => {
  clearInterval(timer)
})
```

---

## 5. v-if 조건부 렌더링

각 지역의 현재 기온을 기준으로 서로 다른 상태를 표시합니다.

```vue
<p v-if="item.temp >= 30">🔥 열대야</p>
<p v-else-if="item.temp >= 25">☀️ 더움</p>
<p v-else-if="item.temp >= 20">🌤️ 시원</p>
<p v-else>❄️ 추위</p>
```

| 온도              | 표시 결과 |
| --------------- | ----- |
| 30℃ 이상          | 열대야   |
| 25℃ 이상 ~ 30℃ 미만 | 더움    |
| 20℃ 이상 ~ 25℃ 미만 | 시원    |
| 20℃ 미만          | 추위    |

이를 통해 `v-if`, `v-else-if`, `v-else`를 이용한 조건부 렌더링을 실습했습니다.

---

## 6. 도시 검색

도시 이름을 입력하여 해당 지역의 날씨를 검색할 수 있도록 구현했습니다.

입력값은 `:value`와 `@input`을 사용하여 관리합니다.

```vue
<input
  type="text"
  :value="inputValue"
  @input="inputValue = $event.target.value"
  @keyup.enter="searchCity"
  placeholder="한글로 입력해주세요."
/>
```

입력값을 `v-model`로 처리하지 않고 `:value`와 `@input`을 직접 사용하여 양방향 데이터 처리가 이루어지는 과정을 실습했습니다.

검색은 입력할 때마다 실행되는 것이 아니라 **Enter 키를 눌렀을 때만 실행**됩니다.

```vue
@keyup.enter="searchCity"
```

---

## 6-1. 검색어 공백 처리

검색 시 입력값의 앞뒤에 존재하는 불필요한 공백을 `trim()`을 사용하여 제거합니다.

```js
const cityName = inputValue.value.trim()
```

예를 들어 다음과 같이 입력하더라도:

```text
   서울   
```

검색 시에는 다음과 같이 처리됩니다.

```text
서울
```

이를 통해 사용자가 실수로 입력한 앞뒤 공백 때문에 검색 결과가 나오지 않는 문제를 방지했습니다.

---

## 6-2. 검색 결과 표시

검색이 실행되면 검색한 도시명과 검색 결과를 화면에 표시합니다.

검색 결과가 존재하는 경우:

```vue
<p v-if="searchResult">
  {{ searchResult.name }}의 날씨는
  {{ searchResult.temp }}℃,
  {{ searchResult.status }}입니다.
</p>
```

검색 결과가 없는 경우:

```vue
<p v-else>검색 결과가 없습니다.</p>
```

이를 통해 `v-if`와 `v-else`를 활용하여 검색 결과의 존재 여부에 따라 서로 다른 화면을 출력합니다.

---

## 7. 날씨 카드 선택 이벤트

날씨 카드를 클릭하면 선택한 지역의 정보가 상태창에 표시됩니다.

```vue
@click="selectCity(item.name)"
```

클릭 이벤트가 발생하면 다음 함수가 실행됩니다.

```js
const selectCity = (cityName) => {
  selectedCityInfo.value = `${cityName}이 선택되었습니다.`
}
```

예를 들어 서울 카드를 클릭하면 상태창에 다음과 같이 표시됩니다.

```text
서울이 선택되었습니다.
```

이를 통해 `@click`을 활용한 이벤트 처리를 실습했습니다.

---

## 7-1. 상세보기 및 이벤트 버블링 방지

각 날씨 카드에는 `[상세보기]` 버튼이 포함되어 있습니다.

```vue
<button
  class="btn-detail"
  @click.stop="showDetail(item.name, item.status)"
>
  상세보기
</button>
```

버튼을 클릭하면 해당 지역의 날씨 정보를 `window.alert()`로 표시합니다.

```js
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
```

여기서 `.stop` 수식어를 사용하여 버튼에서 발생한 클릭 이벤트가 부모인 날씨 카드로 전달되지 않도록 했습니다.

따라서 상세보기 버튼을 클릭하면:

```text
서울의 현재 날씨는 [맑음] 상태입니다.
```

라는 Alert만 표시되고, 부모 카드의 `@click` 이벤트는 실행되지 않습니다.

---

## 8. computed 활용

현재 화면에 표시할 날씨 데이터를 `computed`를 사용하여 계산합니다.

```js
const visibleWeatherList = computed(() => {
  ...
})
```

`currentPage`가 변경되면 `visibleWeatherList`가 자동으로 다시 계산되어 화면에 표시되는 날씨 카드가 변경됩니다.

이를 통해 Vue의 반응형 데이터와 `computed`의 관계를 확인했습니다.

---

## 9. CSS 분리

화면의 스타일은 Vue 컴포넌트와 별도의 CSS 파일에서 관리합니다.

```text
src/
└── assets/
    └── exercise.css
```

공통 스타일을 별도의 CSS 파일에서 관리하여 `WeatherMockup.vue`에서는 화면 구조와 기능 구현에 집중할 수 있도록 구성했습니다.

---

## 10. 구현한 Vue 핵심 문법

이번 Mockup Exercise에서 사용한 주요 Vue 문법은 다음과 같습니다.

```text
ref
computed
v-for
v-if
v-else-if
v-else
:value
@input
@keyup.enter
@click
@click.stop
:key
onMounted
onUnmounted
```

이를 통해 Vue의 기본적인 반응형 데이터 관리, 목록 렌더링, 조건부 렌더링, 입력값 처리, 이벤트 처리 및 주기적인 화면 변경 방식을 실습했습니다.

---

## 11. 구현 결과

현재 Weather Mockup은 다음과 같은 흐름으로 동작합니다.

1. 날씨 데이터 배열을 기반으로 지역별 날씨 카드를 생성
2. `v-for`를 통해 날씨 카드를 화면에 출력
3. 한 번에 4개의 지역만 표시
4. 10초마다 다음 4개 지역으로 자동 변경
5. 각 지역의 기온에 따라 `v-if` 상태 표시
6. 도시 이름을 입력하고 Enter 키를 눌러 검색
7. 검색어의 앞뒤 공백을 `trim()`으로 제거
8. 검색 결과가 존재하면 해당 도시의 날씨 정보 출력
9. 검색 결과가 없으면 검색 결과가 없다는 메시지 출력
10. 날씨 카드를 클릭하면 선택된 도시를 상태창에 표시
11. 상세보기 버튼을 클릭하면 해당 지역의 날씨를 Alert로 표시
12. `.stop`을 통해 상세보기 버튼의 클릭 이벤트가 부모 카드로 전달되는 것을 방지

---

## 12. 학습 내용

이번 Exercise를 통해 Vue의 기본 문법을 실제 날씨 데이터에 적용하여 동작을 확인했습니다.

특히 `v-for`를 이용한 목록 렌더링, `v-if`를 이용한 조건부 화면 구성, `:value`와 `@input`을 이용한 입력값 처리, `@click`과 `@click.stop`을 이용한 이벤트 처리 등을 하나의 화면에서 연결하여 구현했습니다.

또한 `computed`와 반응형 상태를 이용하여 현재 화면에 필요한 데이터만 계산하고, `setInterval`과 `onMounted`, `onUnmounted`를 이용하여 일정 시간마다 화면이 자동으로 변경되도록 구현했습니다.
