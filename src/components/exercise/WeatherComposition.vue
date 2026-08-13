<script setup>
import { ref, computed, watch, watchEffect, onMounted, onUnmounted } from 'vue'

// 1. 반응형 상태 관리
// 지역별 날씨 데이터
const weatherList = ref([
  // 서울
  { id: 'city_01', name: '서울특별시 강남구', temp: 30, status: '맑음', humidity: 65 },
  { id: 'city_02', name: '서울특별시 종로구', temp: 29, status: '맑음', humidity: 68 },
  { id: 'city_03', name: '서울특별시 마포구', temp: 30, status: '맑음', humidity: 67 },
  { id: 'city_04', name: '서울특별시 송파구', temp: 31, status: '맑음', humidity: 64 },

  // 인천
  { id: 'city_05', name: '인천광역시 남동구', temp: 29, status: '맑음', humidity: 68 },
  { id: 'city_06', name: '인천광역시 부평구', temp: 28, status: '구름', humidity: 72 },
  { id: 'city_07', name: '인천광역시 연수구', temp: 29, status: '맑음', humidity: 67 },

  // 부산
  { id: 'city_08', name: '부산광역시 해운대구', temp: 28, status: '맑음', humidity: 80 },
  { id: 'city_09', name: '부산광역시 부산진구', temp: 27, status: '구름', humidity: 82 },
  { id: 'city_10', name: '부산광역시 남구', temp: 28, status: '맑음', humidity: 79 },
  { id: 'city_11', name: '부산광역시 동래구', temp: 27, status: '구름', humidity: 81 },

  // 대구
  { id: 'city_12', name: '대구광역시 중구', temp: 32, status: '맑음', humidity: 60 },
  { id: 'city_13', name: '대구광역시 수성구', temp: 31, status: '맑음', humidity: 62 },
  { id: 'city_14', name: '대구광역시 달서구', temp: 32, status: '맑음', humidity: 59 },

  // 광주
  { id: 'city_15', name: '광주광역시 동구', temp: 31, status: '맑음', humidity: 65 },
  { id: 'city_16', name: '광주광역시 서구', temp: 30, status: '맑음', humidity: 67 },
  { id: 'city_17', name: '광주광역시 북구', temp: 31, status: '맑음', humidity: 64 },

  // 대전
  { id: 'city_18', name: '대전광역시 서구', temp: 24, status: '구름', humidity: 70 },
  { id: 'city_19', name: '대전광역시 유성구', temp: 25, status: '구름', humidity: 69 },
  { id: 'city_20', name: '대전광역시 중구', temp: 24, status: '비', humidity: 73 },

  // 울산
  { id: 'city_21', name: '울산광역시 남구', temp: 23, status: '비', humidity: 78 },
  { id: 'city_22', name: '울산광역시 중구', temp: 24, status: '비', humidity: 76 },
  { id: 'city_23', name: '울산광역시 북구', temp: 23, status: '구름', humidity: 79 },

  // 경기도
  { id: 'city_24', name: '경기도 수원시', temp: 30, status: '맑음', humidity: 67 },
  { id: 'city_25', name: '경기도 성남시', temp: 29, status: '맑음', humidity: 69 },
  { id: 'city_26', name: '경기도 고양시', temp: 27, status: '구름', humidity: 71 },
  { id: 'city_27', name: '경기도 용인시', temp: 29, status: '맑음', humidity: 68 },
  { id: 'city_28', name: '경기도 부천시', temp: 28, status: '구름', humidity: 72 },
  { id: 'city_29', name: '경기도 안양시', temp: 29, status: '맑음', humidity: 69 },
  { id: 'city_30', name: '경기도 화성시', temp: 30, status: '맑음', humidity: 66 },
  { id: 'city_31', name: '경기도 평택시', temp: 29, status: '맑음', humidity: 68 },

  // 강원
  { id: 'city_32', name: '강원특별자치도 춘천시', temp: 22, status: '비', humidity: 82 },
  { id: 'city_33', name: '강원특별자치도 강릉시', temp: 24, status: '구름', humidity: 78 },
  { id: 'city_34', name: '강원특별자치도 원주시', temp: 23, status: '비', humidity: 80 },

  // 충청북도
  { id: 'city_35', name: '충청북도 청주시', temp: 26, status: '구름', humidity: 72 },
  { id: 'city_36', name: '충청북도 충주시', temp: 25, status: '맑음', humidity: 70 },

  // 충청남도
  { id: 'city_37', name: '충청남도 천안시', temp: 27, status: '맑음', humidity: 70 },
  { id: 'city_38', name: '충청남도 아산시', temp: 26, status: '구름', humidity: 73 },

  // 전북
  { id: 'city_39', name: '전라북도 전주시', temp: 29, status: '맑음', humidity: 68 },
  { id: 'city_40', name: '전라북도 군산시', temp: 28, status: '맑음', humidity: 71 },

  // 전남
  { id: 'city_41', name: '전라남도 목포시', temp: 30, status: '맑음', humidity: 72 },
  { id: 'city_42', name: '전라남도 여수시', temp: 29, status: '구름', humidity: 75 },

  // 경북
  { id: 'city_43', name: '경상북도 포항시', temp: 30, status: '맑음', humidity: 65 },
  { id: 'city_44', name: '경상북도 경주시', temp: 31, status: '맑음', humidity: 63 },
  { id: 'city_45', name: '경상북도 구미시', temp: 29, status: '맑음', humidity: 64 },

  // 경남
  { id: 'city_46', name: '경상남도 창원시', temp: 28, status: '비', humidity: 76 },
  { id: 'city_47', name: '경상남도 진주시', temp: 29, status: '맑음', humidity: 73 },

  // 제주
  { id: 'city_48', name: '제주특별자치도 제주시', temp: 24, status: '구름', humidity: 78 },
  { id: 'city_49', name: '제주특별자치도 서귀포시', temp: 25, status: '맑음', humidity: 75 },
])

// 검색어
const searchQuery = ref('')

// 선택된 도시 정보
const selectedCityInfo = ref('지역을 선택해주세요.')

// 선택된 도시의 날씨 데이터
const selectedWeather = ref(null)

// 2. computed 활용
// 검색어가 도시 이름에 포함된 항목만 필터링
const filteredWeatherList = computed(() => {
  const keyword = searchQuery.value.trim()

  // 검색어가 없으면 전체 데이터를 반환
  if (!keyword) {
    return weatherList.value
  }

  // 도시 이름에 검색어가 포함된 데이터만 반환
  return weatherList.value.filter((item) => item.name.includes(keyword))
})

// 검색하지 않을 때 화면에 보여줄 랜덤 날씨 목록
const randomWeatherList = ref([])

// 날씨 데이터 중에서 랜덤으로 4개를 선택
const getRandomWeather = () => {
  // 원본 데이터를 복사한 후 무작위로 섞음
  const shuffled = [...weatherList.value].sort(() => Math.random() - 0.5)

  // 섞인 데이터 중 앞에서 4개만 선택
  randomWeatherList.value = shuffled.slice(0, 4)
}

// 실제 화면에 표시할 날씨 목록
// 검색어가 있으면 검색 결과를 표시하고,
// 검색어가 없으면 랜덤으로 4개를 표시
const currentWeatherList = computed(() => {
  if (searchQuery.value.trim() !== '') {
    return filteredWeatherList.value
  }

  return randomWeatherList.value
})

// 3. watch
// 선택된 도시 정보가 변경될 때마다 콘솔에 출력
watch(selectedCityInfo, (newValue) => {
  console.log('선택된 도시:', newValue)
})

// 3. watchEffect
// searchQuery가 변경될 때마다 자동으로 실행
watchEffect(() => {
  console.log('현재 검색어:', searchQuery.value)
})

// 5. 본인만의 Computed
// 사용자가 선택한 도시의 온도와 습도를 기준으로 강수 위험도 계산
const rainRisk = computed(() => {
  // 선택된 도시가 없으면 안내 문구 표시
  if (!selectedWeather.value) {
    return '지역을 선택해주세요.'
  }

  const { temp, humidity } = selectedWeather.value

  // 온도와 습도를 기준으로 강수 위험도 계산
  if (humidity >= 80 && temp <= 25) {
    return '높음'
  }

  if (humidity >= 70) {
    return '보통'
  }

  return '낮음'
})

// 도시 카드 클릭
const selectCity = (cityName) => {
  selectedCityInfo.value = `${cityName}이 선택되었습니다.`

  // 클릭한 도시의 날씨 데이터를 저장
  selectedWeather.value = weatherList.value.find((item) => item.name === cityName)
}

// 상세보기 버튼
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

// 10초마다 랜덤 날씨 변경
let timer

onMounted(() => {
  // 처음 화면에 랜덤 날씨 4개 표시
  getRandomWeather()

  // 10초마다 랜덤 날씨를 다시 선택
  timer = setInterval(() => {
    getRandomWeather()
  }, 10000)
})

// 컴포넌트가 사라질 때 타이머 제거
onUnmounted(() => {
  clearInterval(timer)
})
</script>

<!-- 4. 검색 결과 표시 (Template 영역) -->
<template>
  <div class="dashboard-wrapper">
    <!-- 도시 검색 -->
    <section class="search-box">
      <h3>🔍 도시 검색</h3>

      <input
        type="text"
        :value="searchQuery"
        @input="searchQuery = $event.target.value"
        placeholder="도시 이름을 입력해주세요."
      />

      <p>
        검색어:
        <strong>{{ searchQuery }}</strong>
      </p>
    </section>

    <!-- 지역별 날씨 현황 -->
    <section class="list-box">
      <h3>🏙️ 지역별 날씨 현황</h3>

      <!-- 검색 결과가 없는 경우 -->
      <div v-if="searchQuery.trim() !== '' && currentWeatherList.length === 0">
        <p>검색 결과와 일치하는 도시가 없습니다.</p>
      </div>

      <!-- 검색 결과 또는 랜덤 날씨 표시 -->
      <div v-else>
        <div
          v-for="item in currentWeatherList"
          :key="item.id"
          class="weather-card"
          @click="selectCity(item.name)"
        >
          <h4>{{ item.name }}</h4>

          <p>
            현재 기온: {{ item.temp }}℃ /
            {{ item.status }}
          </p>

          <p>습도: {{ item.humidity }}%</p>

          <button class="btn-detail" @click.stop="showDetail(item.name, item.status)">
            상세보기
          </button>
        </div>
      </div>
    </section>

    <!-- 선택된 도시 상태 -->
    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>

    <!-- 추가한 Computed 결과 -->
    <p class="rain-risk">현재 지역 강수 위험도: {{ rainRisk }}</p>
  </div>
</template>
