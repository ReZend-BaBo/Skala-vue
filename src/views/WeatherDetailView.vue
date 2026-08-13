```vue
<script setup>
import { ref, computed, onMounted } from 'vue'

import axios from 'axios'

import { useRoute, useRouter } from 'vue-router'

import { useConfigStore } from '@/stores/configStore'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()

// --------------------------------------------------
// OpenWeatherMap API
// --------------------------------------------------

const WEATHER_API_KEY = '68aad9d2f68b0ebda8df2582a9e11857'

const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'

const AIR_POLLUTION_URL = 'https://api.openweathermap.org/data/2.5/air_pollution'

// --------------------------------------------------
// OpenStreetMap Overpass API
// API Key 필요 없음
// --------------------------------------------------

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter'

// --------------------------------------------------
// localStorage
// --------------------------------------------------

const STORAGE_KEY = 'weatherLocations'

// --------------------------------------------------
// 반응형 상태
// --------------------------------------------------

const cityData = ref(null)

const airData = ref(null)

const touristSpots = ref([])

const isLoading = ref(false)

const errorMessage = ref('')

const touristError = ref('')

// --------------------------------------------------
// 저장된 지역 찾기
// --------------------------------------------------

const findSavedCity = () => {
  const saved = localStorage.getItem(STORAGE_KEY)

  if (!saved) {
    return null
  }

  try {
    const locations = JSON.parse(saved)

    return locations.find((item) => item.id === route.params.cityId)
  } catch (error) {
    console.error('저장된 지역 데이터를 불러오지 못했습니다.', error)

    return null
  }
}

// --------------------------------------------------
// 현재 날씨
// --------------------------------------------------

const fetchWeatherDetail = async (location) => {
  const response = await axios.get(WEATHER_URL, {
    params: {
      lat: location.lat,
      lon: location.lon,
      appid: WEATHER_API_KEY,
      units: 'metric',
      lang: 'kr',
    },
  })

  return response.data
}

// --------------------------------------------------
// 대기질
// --------------------------------------------------

const fetchAirPollution = async (location) => {
  const response = await axios.get(AIR_POLLUTION_URL, {
    params: {
      lat: location.lat,
      lon: location.lon,
      appid: WEATHER_API_KEY,
    },
  })

  return response.data
}

// --------------------------------------------------
// OpenStreetMap 관광지
//
// 관광/역사 관련 태그를 기준으로
// 현재 지역 반경 10km 안의 장소를 검색
// --------------------------------------------------

const fetchTouristSpots = async (location) => {
  const query = `
[out:json][timeout:25];

(
  nwr(
    around:10000,${location.lat},${location.lon}
  )["tourism"~"attraction|museum|gallery|zoo|theme_park|viewpoint"]["name"];

  nwr(
    around:10000,${location.lat},${location.lon}
  )["historic"~"castle|archaeological_site|monument|memorial|ruins"]["name"];
);

out center;
`

  const response = await axios.get(OVERPASS_URL, {
    params: {
      data: query,
    },
  })

  const elements = response.data?.elements || []

  // ----------------------------------------------
  // 중복 제거
  // ----------------------------------------------

  const uniqueItems = new Map()

  elements.forEach((item) => {
    const key = `${item.type}-${item.id}`

    if (!uniqueItems.has(key)) {
      uniqueItems.set(key, item)
    }
  })

  // ----------------------------------------------
  // 관광지 데이터 정리
  // ----------------------------------------------

  const spots = Array.from(uniqueItems.values())
    .map((item) => {
      // node는 lat/lon
      // way/relation은 center.lat/lon
      const lat = item.lat ?? item.center?.lat

      const lon = item.lon ?? item.center?.lon

      if (lat == null || lon == null) {
        return null
      }

      const tags = item.tags || {}

      const category = tags.tourism || tags.historic || '관광 명소'

      return {
        id: `${item.type}-${item.id}`,

        name: tags.name || '이름 없는 관광지',

        category,

        lat,

        lon,

        distance: calculateDistance(location.lat, location.lon, lat, lon),

        mapUrl: `https://www.openstreetmap.org/${item.type}/${item.id}`,
      }
    })
    .filter(Boolean)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5)

  return spots
}

// --------------------------------------------------
// 두 좌표 사이 거리 계산
// Haversine 공식
// 단위: km
// --------------------------------------------------

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const earthRadius = 6371

  const toRad = (value) => (value * Math.PI) / 180

  const dLat = toRad(lat2 - lat1)

  const dLon = toRad(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return earthRadius * c
}

// --------------------------------------------------
// AQI 상태
// OpenWeatherMap AQI 1~5
// --------------------------------------------------

const getAirQualityStatus = (aqi) => {
  switch (aqi) {
    case 1:
      return '좋음'

    case 2:
      return '보통'

    case 3:
      return '나쁨'

    case 4:
    case 5:
      return '매우 나쁨'

    default:
      return '정보 없음'
  }
}

// --------------------------------------------------
// 마스크 안내
// 앱의 생활 정보용 기준
// --------------------------------------------------

const getMaskRecommendation = (aqi) => {
  switch (aqi) {
    case 1:
      return '마스크 불필요'

    case 2:
      return '일반 마스크'

    case 3:
      return 'KF80 이상'

    case 4:
    case 5:
      return 'KF94'

    default:
      return '정보 없음'
  }
}

// --------------------------------------------------
// 상세 데이터 조회
// --------------------------------------------------

const fetchDetail = async () => {
  isLoading.value = true

  errorMessage.value = ''
  touristError.value = ''

  cityData.value = null
  airData.value = null
  touristSpots.value = []

  try {
    const location = findSavedCity()

    if (!location) {
      throw new Error('저장된 지역 정보를 찾을 수 없습니다.')
    }

    // ----------------------------------------------
    // 1. 현재 날씨
    // ----------------------------------------------

    if (!WEATHER_API_KEY) {
      throw new Error('OpenWeatherMap API Key가 없습니다.')
    }

    const weatherData = await fetchWeatherDetail(location)

    cityData.value = {
      ...location,

      temp: weatherData.main.temp,

      feelsLike: weatherData.main.feels_like,

      status: weatherData.weather?.[0]?.description || '정보 없음',

      icon: weatherData.weather?.[0]?.icon || null,

      humidity: weatherData.main.humidity,

      pressure: weatherData.main.pressure,

      windSpeed: weatherData.wind?.speed ?? 0,

      visibility: weatherData.visibility ?? 0,

      updatedAt: Date.now(),
    }

    // ----------------------------------------------
    // 2. 대기질
    // 실패하더라도 날씨 화면은 유지
    // ----------------------------------------------

    try {
      const airResponse = await fetchAirPollution(location)

      const air = airResponse.list?.[0]

      if (air) {
        const aqi = air.main?.aqi ?? null

        airData.value = {
          aqi,

          status: getAirQualityStatus(aqi),

          pm25: air.components?.pm2_5 ?? null,

          pm10: air.components?.pm10 ?? null,

          co: air.components?.co ?? null,

          no2: air.components?.no2 ?? null,

          o3: air.components?.o3 ?? null,

          mask: getMaskRecommendation(aqi),
        }
      }
    } catch (error) {
      console.error('대기질 API 조회 실패:', error)

      airData.value = null
    }

    // ----------------------------------------------
    // 3. OpenStreetMap 관광지
    // 실패하더라도 날씨 화면은 유지
    // ----------------------------------------------

    try {
      touristSpots.value = await fetchTouristSpots(location)
    } catch (error) {
      console.error('OpenStreetMap 관광지 조회 실패:', error)

      touristError.value = '관광지 정보를 불러오지 못했습니다.'

      touristSpots.value = []
    }
  } catch (error) {
    console.error('상세 날씨 조회 실패:', error)

    if (axios.isAxiosError(error)) {
      errorMessage.value = error.response?.data?.message || '날씨 정보를 불러오지 못했습니다.'
    } else if (error instanceof Error) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = '날씨 정보를 불러오지 못했습니다.'
    }
  } finally {
    isLoading.value = false
  }
}

// --------------------------------------------------
// 섭씨 / 화씨
// --------------------------------------------------

const displayTemp = computed(() => {
  if (!cityData.value) {
    return null
  }

  const rawTemp = cityData.value.temp

  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }

  return rawTemp
})

const displayFeelsLike = computed(() => {
  if (!cityData.value) {
    return null
  }

  const rawTemp = cityData.value.feelsLike

  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }

  return rawTemp
})

// --------------------------------------------------
// 대시보드 복귀
// --------------------------------------------------

const goToDashboard = () => {
  router.push('/exercise4')
}

// --------------------------------------------------
// 최초 실행
// --------------------------------------------------

onMounted(() => {
  fetchDetail()
})
</script>

<template>
  <div class="detail-container">
    <!-- ------------------------------------------ -->
    <!-- 로딩 -->
    <!-- ------------------------------------------ -->

    <div v-if="isLoading" class="state-message">
      <p>실시간 날씨 정보를 불러오는 중입니다...</p>
    </div>

    <!-- ------------------------------------------ -->
    <!-- 날씨 오류 -->
    <!-- ------------------------------------------ -->

    <div v-else-if="errorMessage" class="state-message error">
      <p>
        {{ errorMessage }}
      </p>

      <button @click="fetchDetail">다시 불러오기</button>
    </div>

    <!-- ------------------------------------------ -->
    <!-- 정상 -->
    <!-- ------------------------------------------ -->

    <template v-else-if="cityData">
      <h3>📊 지역별 상세 기상 관측 정보</h3>

      <hr />

      <!-- ---------------------------------------- -->
      <!-- 날씨 -->
      <!-- ---------------------------------------- -->

      <div class="info-card">
        <h4>📍 {{ cityData.name }}</h4>

        <div class="main-weather">
          <strong> {{ displayTemp }}{{ configStore.unitSymbol }} </strong>

          <span>
            {{ cityData.status }}
          </span>
        </div>

        <div class="info-list">
          <div>
            <span> 체감 온도 </span>

            <strong> {{ displayFeelsLike }}{{ configStore.unitSymbol }} </strong>
          </div>

          <div>
            <span> 습도 </span>

            <strong> {{ cityData.humidity }}% </strong>
          </div>

          <div>
            <span> 기압 </span>

            <strong>
              {{ cityData.pressure }}
              hPa
            </strong>
          </div>

          <div>
            <span> 풍속 </span>

            <strong>
              {{ cityData.windSpeed }}
              m/s
            </strong>
          </div>

          <div>
            <span> 가시거리 </span>

            <strong>
              {{ (cityData.visibility / 1000).toFixed(1) }}
              km
            </strong>
          </div>
        </div>
      </div>

      <!-- ---------------------------------------- -->
      <!-- 대기질 -->
      <!-- ---------------------------------------- -->

      <div v-if="airData" class="info-card">
        <div class="card-header">
          <h4>🌫️ 대기질 정보</h4>

          <span class="aqi-badge" :class="`aqi-${airData.aqi}`">
            AQI
            {{ airData.aqi }}
          </span>
        </div>

        <div class="air-status">
          <strong>
            {{ airData.status }}
          </strong>

          <span> 현재 대기질 상태 </span>
        </div>

        <div class="info-list">
          <div>
            <span> PM2.5 </span>

            <strong>
              {{ airData.pm25?.toFixed(2) }}
              μg/m³
            </strong>
          </div>

          <div>
            <span> PM10 </span>

            <strong>
              {{ airData.pm10?.toFixed(2) }}
              μg/m³
            </strong>
          </div>

          <div>
            <span> CO </span>

            <strong>
              {{ airData.co?.toFixed(2) }}
              μg/m³
            </strong>
          </div>

          <div>
            <span> NO₂ </span>

            <strong>
              {{ airData.no2?.toFixed(2) }}
              μg/m³
            </strong>
          </div>

          <div>
            <span> O₃ </span>

            <strong>
              {{ airData.o3?.toFixed(2) }}
              μg/m³
            </strong>
          </div>
        </div>

        <!-- 마스크 안내 -->
        <div class="mask-box">
          <span class="mask-icon"> 😷 </span>

          <div>
            <strong> 외출 안내 </strong>

            <p>
              {{ airData.mask }}
            </p>
          </div>
        </div>

        <p class="info-note">* 마스크 안내는 앱에서 설정한 생활 정보 기준입니다.</p>
      </div>

      <!-- ---------------------------------------- -->
      <!-- 관광지 -->
      <!-- ---------------------------------------- -->

      <div class="info-card">
        <div class="card-header">
          <h4>🏛️ 주변 관광 명소</h4>

          <span class="tourist-count"> {{ touristSpots.length }}곳 </span>
        </div>

        <!-- 오류 -->
        <p v-if="touristError" class="tourist-error">
          {{ touristError }}
        </p>

        <!-- 결과 없음 -->
        <p v-else-if="touristSpots.length === 0" class="empty-message">
          주변 관광 명소를 찾지 못했습니다.
        </p>

        <!-- 관광지 -->
        <div v-else class="tourist-list">
          <a
            v-for="spot in touristSpots"
            :key="spot.id"
            :href="spot.mapUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="tourist-item"
          >
            <div class="tourist-content">
              <strong>
                {{ spot.name }}
              </strong>

              <span>
                {{ spot.category }}
              </span>

              <small>
                {{ spot.distance.toFixed(1) }}
                km
              </small>
            </div>

            <span class="tourist-arrow"> → </span>
          </a>
        </div>

        <p class="info-note">* 관광지 정보는 OpenStreetMap 데이터를 활용합니다.</p>
      </div>

      <!-- ---------------------------------------- -->
      <!-- 복귀 -->
      <!-- ---------------------------------------- -->

      <button class="back-btn" @click="goToDashboard">← 날씨 대시보드로 돌아가기</button>
    </template>
  </div>
</template>

<style scoped>
.detail-container {
  width: 600px;

  margin: 0 auto;

  padding: 20px;

  background: white;

  border-radius: 8px;

  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
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

.state-message button {
  margin-top: 10px;

  padding: 8px 15px;

  border: none;

  border-radius: 5px;

  background: #3498db;

  color: white;

  cursor: pointer;
}

/* ---------------------------------------- */
/* 날씨 */
/* ---------------------------------------- */

.info-card {
  margin: 15px 0;

  padding: 20px;

  background: #f8f9fa;

  border-radius: 8px;
}

.info-card h4 {
  margin: 0 0 15px;
}

.card-header {
  display: flex;

  justify-content: space-between;

  align-items: center;
}

.card-header h4 {
  margin: 0;
}

.main-weather {
  display: flex;

  align-items: baseline;

  gap: 12px;

  padding-bottom: 15px;

  border-bottom: 1px solid #ddd;
}

.main-weather strong {
  font-size: 32px;
}

.main-weather span {
  color: #666;
}

.info-list {
  margin-top: 10px;
}

.info-list > div {
  display: flex;

  justify-content: space-between;

  padding: 9px 0;

  border-bottom: 1px solid #eee;
}

.info-list > div:last-child {
  border-bottom: none;
}

/* ---------------------------------------- */
/* 대기질 */
/* ---------------------------------------- */

.aqi-badge {
  padding: 5px 10px;

  border-radius: 15px;

  background: #e0e0e0;

  font-size: 12px;

  font-weight: bold;
}

.aqi-1 {
  background: #d9f7be;

  color: #237804;
}

.aqi-2 {
  background: #fff1b8;

  color: #ad6800;
}

.aqi-3 {
  background: #ffd591;

  color: #ad4e00;
}

.aqi-4,
.aqi-5 {
  background: #ffa39e;

  color: #820014;
}

.air-status {
  display: flex;

  justify-content: space-between;

  align-items: center;

  margin-top: 10px;

  padding-bottom: 10px;

  border-bottom: 1px solid #ddd;
}

.air-status span {
  font-size: 12px;

  color: #777;
}

.mask-box {
  display: flex;

  align-items: center;

  gap: 12px;

  margin-top: 15px;

  padding: 12px;

  background: white;

  border: 1px solid #e5e5e5;

  border-radius: 8px;
}

.mask-icon {
  font-size: 28px;
}

.mask-box p {
  margin: 3px 0 0;

  font-size: 14px;

  font-weight: bold;
}

/* ---------------------------------------- */
/* 관광지 */
/* ---------------------------------------- */

.tourist-count {
  padding: 4px 8px;

  border-radius: 12px;

  background: #e8f4ff;

  color: #2980b9;

  font-size: 11px;

  font-weight: bold;
}

.tourist-list {
  display: flex;

  flex-direction: column;

  gap: 8px;

  margin-top: 10px;
}

.tourist-item {
  display: flex;

  justify-content: space-between;

  align-items: center;

  padding: 12px;

  background: white;

  border: 1px solid #e5e5e5;

  border-radius: 7px;

  color: inherit;

  text-decoration: none;

  transition:
    background 0.15s ease,
    transform 0.15s ease;
}

.tourist-item:hover {
  background: #f1f6fa;

  transform: translateX(2px);
}

.tourist-content {
  display: flex;

  flex-direction: column;

  gap: 3px;

  min-width: 0;
}

.tourist-content strong {
  font-size: 14px;
}

.tourist-content span {
  color: #777;

  font-size: 11px;
}

.tourist-content small {
  color: #999;

  font-size: 10px;
}

.tourist-arrow {
  padding-left: 10px;

  color: #3498db;

  font-size: 18px;

  font-weight: bold;
}

.tourist-error {
  margin: 12px 0;

  color: #c0392b;

  font-size: 13px;
}

.empty-message {
  padding: 15px 0;

  text-align: center;

  color: #777;
}

/* ---------------------------------------- */
/* 공통 안내 */
/* ---------------------------------------- */

.info-note {
  margin: 10px 0 0;

  color: #999;

  font-size: 10px;
}

/* ---------------------------------------- */
/* 복귀 */
/* ---------------------------------------- */

.back-btn {
  padding: 8px 12px;

  background: #2c3e50;

  color: white;

  border: none;

  border-radius: 4px;

  cursor: pointer;
}
</style>
```
