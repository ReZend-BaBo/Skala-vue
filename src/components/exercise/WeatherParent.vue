<script setup>
import { ref, computed, watch, watchEffect } from 'vue'

import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'

const weatherList = ref([
  // 서울
  { id: 'city_01', name: '서울특별시 강남구', temp: 30, status: '맑음' },
  { id: 'city_02', name: '서울특별시 종로구', temp: 29, status: '맑음' },
  { id: 'city_03', name: '서울특별시 마포구', temp: 30, status: '맑음' },
  { id: 'city_04', name: '서울특별시 송파구', temp: 31, status: '맑음' },
  // 인천
  { id: 'city_05', name: '인천광역시 남동구', temp: 29, status: '맑음' },
  { id: 'city_06', name: '인천광역시 부평구', temp: 28, status: '구름' },
  { id: 'city_07', name: '인천광역시 연수구', temp: 29, status: '맑음' },
  // 부산
  { id: 'city_08', name: '부산광역시 해운대구', temp: 28, status: '맑음' },
  { id: 'city_09', name: '부산광역시 부산진구', temp: 27, status: '구름' },
  { id: 'city_10', name: '부산광역시 남구', temp: 28, status: '맑음' },
  { id: 'city_11', name: '부산광역시 동래구', temp: 27, status: '구름' },
  // 대구
  { id: 'city_12', name: '대구광역시 중구', temp: 32, status: '맑음' },
  { id: 'city_13', name: '대구광역시 수성구', temp: 31, status: '맑음' },
  { id: 'city_14', name: '대구광역시 달서구', temp: 32, status: '맑음' },
  // 광주
  { id: 'city_15', name: '광주광역시 동구', temp: 31, status: '맑음' },
  { id: 'city_16', name: '광주광역시 서구', temp: 30, status: '맑음' },
  { id: 'city_17', name: '광주광역시 북구', temp: 31, status: '맑음' },
  // 대전
  { id: 'city_18', name: '대전광역시 서구', temp: 24, status: '구름' },
  { id: 'city_19', name: '대전광역시 유성구', temp: 25, status: '구름' },
  { id: 'city_20', name: '대전광역시 중구', temp: 24, status: '비' },
  // 울산
  { id: 'city_21', name: '울산광역시 남구', temp: 23, status: '비' },
  { id: 'city_22', name: '울산광역시 중구', temp: 24, status: '비' },
  { id: 'city_23', name: '울산광역시 북구', temp: 23, status: '구름' },
  // 경기도
  { id: 'city_24', name: '경기도 수원시', temp: 30, status: '맑음' },
  { id: 'city_25', name: '경기도 성남시', temp: 29, status: '맑음' },
  { id: 'city_26', name: '경기도 고양시', temp: 27, status: '구름' },
  { id: 'city_27', name: '경기도 용인시', temp: 29, status: '맑음' },
  { id: 'city_28', name: '경기도 부천시', temp: 28, status: '구름' },
  { id: 'city_29', name: '경기도 안양시', temp: 29, status: '맑음' },
  { id: 'city_30', name: '경기도 화성시', temp: 30, status: '맑음' },
  { id: 'city_31', name: '경기도 평택시', temp: 29, status: '맑음' },
  // 강원
  { id: 'city_32', name: '강원특별자치도 춘천시', temp: 22, status: '비' },
  { id: 'city_33', name: '강원특별자치도 강릉시', temp: 24, status: '구름' },
  { id: 'city_34', name: '강원특별자치도 원주시', temp: 23, status: '비' },
  // 충청북도
  { id: 'city_35', name: '충청북도 청주시', temp: 26, status: '구름' },
  { id: 'city_36', name: '충청북도 충주시', temp: 25, status: '맑음' },
  // 충청남도
  { id: 'city_37', name: '충청남도 천안시', temp: 27, status: '맑음' },
  { id: 'city_38', name: '충청남도 아산시', temp: 26, status: '구름' },
  // 전북
  { id: 'city_39', name: '전라북도 전주시', temp: 29, status: '맑음' },
  { id: 'city_40', name: '전라북도 군산시', temp: 28, status: '맑음' },
  // 전남
  { id: 'city_41', name: '전라남도 목포시', temp: 30, status: '맑음' },
  { id: 'city_42', name: '전라남도 여수시', temp: 29, status: '구름' },
  // 경북
  { id: 'city_43', name: '경상북도 포항시', temp: 30, status: '맑음' },
  { id: 'city_44', name: '경상북도 경주시', temp: 31, status: '맑음' },
  { id: 'city_45', name: '경상북도 구미시', temp: 29, status: '맑음' },
  // 경남
  { id: 'city_46', name: '경상남도 창원시', temp: 28, status: '비' },
  { id: 'city_47', name: '경상남도 진주시', temp: 29, status: '맑음' },
  // 제주
  { id: 'city_48', name: '제주특별자치도 제주시', temp: 24, status: '구름' },
  { id: 'city_49', name: '제주특별자치도 서귀포시', temp: 25, status: '맑음' },
])

// 검색
const searchQuery = ref('')

// 선택된 도시 정보
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

// 정렬
const sortOrder = ref('default')

// 페이지네이션
const currentPage = ref(1)
const itemsPerPage = 10

// 검색 결과
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()

  if (!query) {
    return weatherList.value
  }

  return weatherList.value.filter((item) => item.name.includes(query))
})

// 정렬 결과
const sortedWeatherList = computed(() => {
  const list = [...filteredWeatherList.value]

  if (sortOrder.value === 'asc') {
    return list.sort((a, b) => a.temp - b.temp)
  }

  if (sortOrder.value === 'desc') {
    return list.sort((a, b) => b.temp - a.temp)
  }

  return list
})

// 전체 페이지 수
const totalPages = computed(() => {
  return Math.ceil(sortedWeatherList.value.length / itemsPerPage)
})

// 현재 페이지에 표시할 데이터
const paginatedWeatherList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage

  return sortedWeatherList.value.slice(start, end)
})

// 페이지 이동
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// 검색어가 변경되면 1페이지로 이동
watch(searchQuery, () => {
  currentPage.value = 1
})

// 정렬 방식이 변경되면 1페이지로 이동
watch(sortOrder, () => {
  currentPage.value = 1
})

// 선택된 도시 정보 감시
watch(selectedCityInfo, (newInfo) => {
  console.log(`👁️‍🗨️ [watch 감지] 상태 바 문구가 업데이트되었습니다 -> "${newInfo}"`)
})

// 검색어 변화를 자동 감지
watchEffect(() => {
  console.log(
    `🤖 [watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 API 데이터를 필터링합니다.`,
  )
})

// 상세 정보 표시
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

// 도시 선택
const selectCity = (city) => {
  selectedCityInfo.value = `${city.name}이 선택되었습니다. 현재 기온은 ${city.temp}°C이며 날씨는 ${city.status}입니다.`
}
</script>

<template>
  <div class="dashboard-wrapper">
    <!-- 검색 -->
    <BaseDashboardCard>
      <SearchBar :current-query="searchQuery" @update-query="(val) => (searchQuery = val)" />
    </BaseDashboardCard>

    <!-- 날씨 목록 -->
    <BaseDashboardCard>
      <h3>🏙️ 지역별 날씨 현황</h3>

      <!-- 정렬 -->
      <select v-model="sortOrder">
        <option value="default">기본순</option>
        <option value="desc">높은 온도순</option>
        <option value="asc">낮은 온도순</option>
      </select>

      <!-- 날씨 카드 -->
      <WeatherCard
        v-for="item in paginatedWeatherList"
        :key="item.id"
        :city-item="item"
        @select-card="selectCity"
        @click-detail="showDetail"
      />

      <!-- 검색 결과 없음 -->
      <p
        v-if="filteredWeatherList.length === 0"
        style="text-align: center; color: #e74c3c; padding: 10px 0"
      >
        😭 검색 결과와 일치하는 도시가 없습니다.
      </p>

      <!-- 페이지네이션 -->
      <div v-if="totalPages > 1" class="pagination">
        <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">이전</button>

        <button
          v-for="page in totalPages"
          :key="page"
          :class="{ active: currentPage === page }"
          @click="changePage(page)"
        >
          {{ page }}
        </button>

        <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
          다음
        </button>
      </div>
    </BaseDashboardCard>

    <!-- 선택 상태 -->
    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  width: 600px;
  margin: 0 auto;
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
</style>
