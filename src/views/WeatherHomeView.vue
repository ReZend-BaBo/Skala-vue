```vue
<script setup>
import { ref, computed, onMounted, onUnmounted, watch, watchEffect } from 'vue'

import axios from 'axios'
import { useConfigStore } from '@/stores/configStore'

import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'
import MarketView from './MarketView.vue'

const configStore = useConfigStore()

// --------------------------------------------------
// OpenWeatherMap API
// --------------------------------------------------

const API_KEY = '68aad9d2f68b0ebda8df2582a9e11857'

const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'

const GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct'

const STORAGE_KEY = 'weatherLocations'

// --------------------------------------------------
// 상태
// --------------------------------------------------

const weatherList = ref([])

const searchQuery = ref('')
const searchError = ref('')

const selectedCityInfo = ref(null)

const isLoading = ref(false)
const errorMessage = ref('')

const currentPage = ref(1)
const itemsPerPage = 10

let refreshTimer = null

// --------------------------------------------------
// localStorage 저장
// --------------------------------------------------

const saveLocations = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(weatherList.value))
}

// --------------------------------------------------
// localStorage 불러오기
// --------------------------------------------------

const loadLocations = () => {
  const saved = localStorage.getItem(STORAGE_KEY)

  if (!saved) {
    return
  }

  try {
    weatherList.value = JSON.parse(saved)
  } catch (error) {
    console.error('저장된 지역 데이터를 불러오지 못했습니다.', error)

    localStorage.removeItem(STORAGE_KEY)
    weatherList.value = []
  }
}

// --------------------------------------------------
// 도시 1개 실시간 날씨 조회
// --------------------------------------------------

const fetchSingleWeather = async (city) => {
  const response = await axios.get(WEATHER_URL, {
    params: {
      lat: city.lat,
      lon: city.lon,
      appid: API_KEY,
      units: 'metric',
      lang: 'kr',
    },
  })

  const data = response.data

  Object.assign(city, {
    temp: data.main.temp,
    feelsLike: data.main.feels_like,
    tempMin: data.main.temp_min,
    tempMax: data.main.temp_max,

    status: data.weather?.[0]?.description || '정보 없음',

    humidity: data.main.humidity,

    pressure: data.main.pressure,

    windSpeed: data.wind?.speed ?? 0,

    visibility: data.visibility ?? 0,

    icon: data.weather?.[0]?.icon ?? null,

    updatedAt: Date.now(),
  })
}

// --------------------------------------------------
// 지역 검색
// 지역명 → 위도/경도 → 날씨 조회
// --------------------------------------------------

const searchLocation = async () => {
  const query = searchQuery.value.trim()

  if (!query) {
    searchError.value = '검색할 지역명을 입력해주세요.'
    return
  }

  if (!API_KEY || API_KEY === 'YOUR_OPENWEATHER_API_KEY') {
    searchError.value = 'OpenWeatherMap API Key를 입력해주세요.'
    return
  }

  searchError.value = ''
  errorMessage.value = ''
  isLoading.value = true

  try {
    // 지역명으로 좌표 검색
    const geoResponse = await axios.get(GEO_URL, {
      params: {
        q: query,
        limit: 1,
        appid: API_KEY,
      },
    })

    if (!geoResponse.data.length) {
      searchError.value = '검색한 지역을 찾을 수 없습니다.'
      return
    }

    const location = geoResponse.data[0]

    // 이미 저장된 지역인지 확인
    const existingIndex = weatherList.value.findIndex(
      (item) =>
        Number(item.lat).toFixed(4) === Number(location.lat).toFixed(4) &&
        Number(item.lon).toFixed(4) === Number(location.lon).toFixed(4),
    )

    // 이미 저장된 지역이면 최신 날씨만 다시 요청
    if (existingIndex !== -1) {
      const existingCity = weatherList.value[existingIndex]

      await fetchSingleWeather(existingCity)

      selectedCityInfo.value = existingCity

      currentPage.value = Math.floor(existingIndex / itemsPerPage) + 1

      saveLocations()

      searchQuery.value = ''

      return
    }

    // 새로운 지역
    const newCity = {
      id: `city_${Date.now()}`,

      name: location.local_names?.ko || location.name,

      lat: location.lat,
      lon: location.lon,

      country: location.country,
      state: location.state || '',

      temp: null,
      feelsLike: null,
      tempMin: null,
      tempMax: null,

      status: '날씨 데이터 조회 중...',

      humidity: null,
      pressure: null,
      windSpeed: null,
      visibility: null,
      icon: null,

      updatedAt: null,
    }

    // 목록에 추가
    weatherList.value.unshift(newCity)

    // 방금 검색한 지역 즉시 조회
    await fetchSingleWeather(newCity)

    // 저장
    saveLocations()

    // 검색창 초기화
    searchQuery.value = ''

    // 첫 페이지
    currentPage.value = 1

    // 방금 검색한 지역 선택
    selectedCityInfo.value = newCity
  } catch (error) {
    console.error('지역 검색 실패:', error)

    if (axios.isAxiosError(error)) {
      searchError.value = error.response?.data?.message || '지역 검색에 실패했습니다.'
    } else {
      searchError.value = '지역 검색 중 오류가 발생했습니다.'
    }
  } finally {
    isLoading.value = false
  }
}

// --------------------------------------------------
// 저장된 지역 전체 갱신
// 3개씩 병렬 요청
// --------------------------------------------------

const refreshWeatherList = async () => {
  if (!weatherList.value.length) {
    return
  }

  if (!API_KEY || API_KEY === 'YOUR_OPENWEATHER_API_KEY') {
    errorMessage.value = 'OpenWeatherMap API Key를 입력해주세요.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    // 3개씩 묶어서 병렬 요청
    for (let i = 0; i < weatherList.value.length; i += 3) {
      const batch = weatherList.value.slice(i, i + 3)

      await Promise.all(batch.map((city) => fetchSingleWeather(city)))
    }

    saveLocations()
  } catch (error) {
    console.error('날씨 데이터 갱신 실패:', error)

    if (axios.isAxiosError(error)) {
      errorMessage.value = error.response?.data?.message || '날씨 데이터를 불러오지 못했습니다.'
    } else {
      errorMessage.value = '날씨 데이터를 불러오는 중 오류가 발생했습니다.'
    }
  } finally {
    isLoading.value = false
  }
}

// --------------------------------------------------
// 검색 결과
// --------------------------------------------------

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()

  if (!query) {
    return weatherList.value
  }

  return weatherList.value.filter((item) => item.name.includes(query))
})

// --------------------------------------------------
// 페이지네이션
// --------------------------------------------------

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredWeatherList.value.length / itemsPerPage))
})

const paginatedWeatherList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage

  const end = start + itemsPerPage

  return filteredWeatherList.value.slice(start, end)
})

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

watch(searchQuery, () => {
  currentPage.value = 1
})

// --------------------------------------------------
// 카드 선택
// --------------------------------------------------

const selectCity = (city) => {
  selectedCityInfo.value = city
}

// --------------------------------------------------
// 선택된 지역 표시 온도
// --------------------------------------------------

const selectedDisplayTemp = computed(() => {
  if (!selectedCityInfo.value || selectedCityInfo.value.temp === null) {
    return null
  }

  const rawTemp = selectedCityInfo.value.temp

  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }

  return rawTemp
})

// --------------------------------------------------
// watch
// --------------------------------------------------

watch(selectedCityInfo, (newCity) => {
  if (newCity) {
    console.log(`[watch] 선택 지역 변경 → ${newCity.name}`)
  }
})

// --------------------------------------------------
// watchEffect
// --------------------------------------------------

watchEffect(() => {
  console.log(`[watchEffect] 검색어 → "${searchQuery.value}"`)
})

// --------------------------------------------------
// 5분 자동 갱신
// --------------------------------------------------

const startAutoRefresh = () => {
  refreshTimer = setInterval(
    () => {
      refreshWeatherList()
    },
    5 * 60 * 1000,
  )
}

// --------------------------------------------------
// 최초 실행
// --------------------------------------------------

onMounted(async () => {
  loadLocations()

  if (weatherList.value.length > 0) {
    await refreshWeatherList()
  }

  startAutoRefresh()
})

// --------------------------------------------------
// 컴포넌트 종료
// --------------------------------------------------

onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
})
</script>

<template>
  <div class="page-wrapper">
    <main class="dashboard-area">
      <h1>과제 4: 날씨 대시보드</h1>

      <hr />

      <!-- 지역 검색 -->
      <BaseDashboardCard>
        <form class="search-form" @submit.prevent="searchLocation">
          <input v-model="searchQuery" placeholder="원하는 지역을 검색하세요" />

          <button type="submit" :disabled="isLoading">검색</button>
        </form>

        <p v-if="searchError" class="error-message">
          {{ searchError }}
        </p>
      </BaseDashboardCard>

      <!-- 로딩 -->
      <div v-if="isLoading" class="state-message">실시간 날씨 데이터를 불러오는 중입니다...</div>

      <!-- 에러 -->
      <div v-else-if="errorMessage" class="state-message error">
        <p>{{ errorMessage }}</p>

        <button class="retry-button" @click="refreshWeatherList">다시 불러오기</button>
      </div>

      <!-- 정상 -->
      <template v-else>
        <BaseDashboardCard>
          <div class="list-header">
            <h3>🏙️ 저장된 지역</h3>

            <button class="refresh-button" @click="refreshWeatherList">↻ 새로고침</button>
          </div>

          <p v-if="weatherList.length === 0" class="empty-message">아직 저장된 지역이 없습니다.</p>

          <WeatherCard
            v-for="item in paginatedWeatherList"
            :key="item.id"
            :city-item="item"
            :enable-router-detail="true"
            @select-card="selectCity"
          />

          <p
            v-if="weatherList.length > 0 && filteredWeatherList.length === 0"
            class="empty-message"
          >
            검색 결과와 일치하는 지역이 없습니다.
          </p>

          <!-- 페이지네이션 -->
          <div v-if="totalPages > 1" class="pagination">
            <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">이전</button>

            <button
              v-for="page in totalPages"
              :key="page"
              :class="{
                active: currentPage === page,
              }"
              @click="changePage(page)"
            >
              {{ page }}
            </button>

            <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
              다음
            </button>
          </div>
        </BaseDashboardCard>

        <!-- 선택 결과 -->
        <div class="status-bar">
          <span v-if="!selectedCityInfo"> 카드를 클릭하거나 검색해 보세요. </span>

          <span v-else>
            <strong>
              {{ selectedCityInfo.name }}
            </strong>
            이 선택되었습니다. 현재 기온은
            <strong> {{ selectedDisplayTemp }}{{ configStore.unitSymbol }} </strong>
            이며 날씨는
            {{ selectedCityInfo.status }}
            입니다.
          </span>
        </div>

        <p class="refresh-info">날씨 데이터는 5분마다 자동으로 갱신됩니다.</p>
      </template>
    </main>
    <MarketView />
  </div>
</template>

<style scoped>
.page-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}

.dashboard-area {
  width: 600px;
  flex-shrink: 0;
}

.search-form {
  display: flex;
  gap: 8px;
}

.search-form input {
  flex: 1;
  padding: 9px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.search-form button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: #3498db;
  color: white;
  cursor: pointer;
}

.search-form button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  margin: 8px 0 0;
  color: #e74c3c;
  font-size: 13px;
}

.state-message {
  padding: 30px;
  text-align: center;
  background: #f8f9fa;
  border-radius: 8px;
}

.state-message.error {
  color: #c0392b;
}

.retry-button {
  margin-top: 10px;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  background: #3498db;
  color: white;
  cursor: pointer;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-header h3 {
  margin: 0;
}

.refresh-button {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: white;
  cursor: pointer;
}

.empty-message {
  padding: 20px 0;
  text-align: center;
  color: #777;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-top: 20px;
}

.pagination button {
  min-width: 36px;
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: white;
  cursor: pointer;
}

.pagination button.active {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

.pagination button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.status-bar {
  margin-top: 15px;
  padding: 12px;
  text-align: center;
  background: #f8f9fa;
  border-radius: 6px;
}

.refresh-info {
  margin-top: 8px;
  text-align: center;
  color: #999;
  font-size: 11px;
}
.page-wrapper {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 20px;
  width: 100%;
}

.dashboard-area {
  width: 600px;
  flex-shrink: 0;
}
</style>
```
