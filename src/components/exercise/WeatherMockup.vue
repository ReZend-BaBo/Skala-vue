<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 지역별 날씨 데이터
// 여러 컴포넌트에서 반복해서 작성하지 않고 한 곳에서 관리
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 30, status: '맑음', humidity: 65 },
  { id: 'city_02', name: '인천', temp: 29, status: '맑음', humidity: 68 },
  { id: 'city_03', name: '경기', temp: 30, status: '맑음', humidity: 67 },
  { id: 'city_04', name: '강원', temp: 22, status: '비', humidity: 82 },
  { id: 'city_05', name: '대구', temp: 32, status: '맑음', humidity: 60 },
  { id: 'city_06', name: '울산', temp: 23, status: '비', humidity: 78 },
  { id: 'city_07', name: '부산', temp: 28, status: '맑음', humidity: 80 },
  { id: 'city_08', name: '대전', temp: 24, status: '구름', humidity: 70 },
  { id: 'city_09', name: '광주', temp: 31, status: '맑음', humidity: 65 },
  { id: 'city_10', name: '충북', temp: 26, status: '구름', humidity: 72 },
  { id: 'city_11', name: '충남', temp: 27, status: '맑음', humidity: 70 },
  { id: 'city_12', name: '전북', temp: 29, status: '맑음', humidity: 68 },
  { id: 'city_13', name: '전남', temp: 30, status: '맑음', humidity: 72 },
  { id: 'city_14', name: '경북', temp: 32, status: '맑음', humidity: 60 },
  { id: 'city_15', name: '경남', temp: 28, status: '비', humidity: 76 },
  { id: 'city_16', name: '제주', temp: 24, status: '구름', humidity: 78 },
])

// 현재 표시할 날씨 카드 묶음 번호
const currentPage = ref(0)

// 현재 페이지의 4개 데이터만 가져오기
const visibleWeatherList = computed(() => {
  const sortedList = [...weatherList.value].sort((a, b) => {
    const numA = Number(a.id.replace('city_', ''))
    const numB = Number(b.id.replace('city_', ''))

    return numA - numB
  })

  const start = currentPage.value * 4

  return sortedList.slice(start, start + 4)
})

// 선택된 도시 상태창
const selectedCityInfo = ref('지역을 선택해주세요.')

// 날씨 카드 선택 이벤트
const selectCity = (cityName) => {
  selectedCityInfo.value = `${cityName}이 선택되었습니다.`
}

// 도시 검색
const searchQuery = ref('')
const searchResult = ref(null)
const searchedCity = ref('')

// Enter 키를 눌렀을 때 도시 검색
const searchCity = () => {
  // 입력값 앞뒤 공백 제거
  const cityName = searchQuery.value.trim()

  searchQuery.value = cityName
  searchedCity.value = cityName

  const city = weatherList.value.find((item) => item.name === cityName)

  searchResult.value = city || null
}

// 상세보기
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

// 날씨 카드 자동 변경 타이머
let timer

// 10초마다 다음 4개 지역으로 변경
onMounted(() => {
  timer = setInterval(() => {
    currentPage.value = (currentPage.value + 1) % 4
  }, 10000)
})

// 컴포넌트가 제거되면 타이머 종료
onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>
  <div class="dashboard-wrapper">
    <!-- 도시 검색 -->
    <section class="search-box">
      <h3>🔍 도시 검색</h3>

      <input
        type="text"
        :value="searchQuery"
        @input="searchQuery = $event.target.value"
        @keyup.enter="searchCity"
        placeholder="한글로 입력해주세요."
      />

      <!-- 검색한 도시명 출력 -->
      <div v-if="searchedCity">
        <p>
          입력한 도시:
          <strong>{{ searchedCity }}</strong>
        </p>

        <!-- 검색 결과가 있는 경우 -->
        <p v-if="searchResult">
          {{ searchResult.name }}의 날씨는 {{ searchResult.temp }}℃,
          {{ searchResult.status }}입니다.
        </p>

        <!-- 검색 결과가 없는 경우 -->
        <p v-else>검색 결과가 없습니다.</p>
      </div>
    </section>

    <!-- 지역별 날씨 현황 -->
    <section class="list-box">
      <h3>🏙️ 지역별 날씨 현황</h3>

      <div
        v-for="item in visibleWeatherList"
        :key="item.id"
        class="weather-card"
        @click="selectCity(item.name)"
      >
        <!-- 도시 이름 -->
        <h4>{{ item.name }}</h4>

        <!-- 현재 날씨 -->
        <div class="weather-info">
          <p class="temperature">{{ item.temp }}℃</p>

          <p>
            {{ item.status }}
          </p>
        </div>

        <!-- v-if를 활용한 온도별 상태 -->
        <div class="weather-info">
          <p v-if="item.temp >= 30">🔥 열대야</p>

          <p v-else-if="item.temp >= 25">☀️ 더움</p>

          <p v-else-if="item.temp >= 20">🌤️ 시원</p>

          <p v-else>❄️ 추위</p>

          <p>습도 {{ item.humidity }}%</p>
        </div>

        <!-- 상세보기 버튼 -->
        <!-- .stop을 사용하여 카드의 click 이벤트로 전파되지 않도록 처리 -->
        <button class="btn-detail" @click.stop="showDetail(item.name, item.status)">
          상세보기
        </button>
      </div>
    </section>

    <!-- 선택된 도시 상태 -->
    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>
