<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'

const props = defineProps({
  cityItem: {
    type: Object,
    required: true,
  },

  // 과제 4에서 상세 페이지 이동 기능 사용
  enableRouterDetail: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select-card', 'click-detail'])

const router = useRouter()
const configStore = useConfigStore()

// 화면에 표시할 온도
// 원본 데이터는 항상 섭씨
const displayTemp = computed(() => {
  const rawTemp = props.cityItem.temp

  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }

  return rawTemp
})

// 원본 섭씨 온도를 기준으로 날씨 상태 판정
const temperatureCondition = computed(() => {
  const temp = props.cityItem.temp

  if (temp >= 30) {
    return '열대야'
  }

  if (temp >= 27 && temp < 30) {
    return '더위'
  }

  if (temp >= 23 && temp < 27) {
    return '선선함'
  }

  return '쌀쌀'
})

// 카드 선택
const selectCard = () => {
  emit('select-card', props.cityItem)
}

// 상세보기
const handleDetail = () => {
  // 과제 4에서는 WeatherDetailView로 이동
  if (props.enableRouterDetail) {
    router.push(`/weather/${props.cityItem.id}`)
    return
  }

  // 기존 과제에서 사용하던 이벤트 방식 유지
  emit('click-detail', props.cityItem.name, props.cityItem.status)
}
</script>

<template>
  <div class="weather-card">
    <!-- 지역 정보 -->
    <div class="card-header">
      <h4>{{ cityItem.name }}</h4>

      <span class="status">
        {{ cityItem.status }}
      </span>
    </div>

    <!-- 기온 -->
    <div class="temperature-area">
      <strong class="temperature"> {{ displayTemp }}{{ configStore.unitSymbol }} </strong>

      <span class="temperature-condition">
        {{ temperatureCondition }}
      </span>
    </div>

    <!-- 체감 상태 -->
    <div class="weather-tags">
      <span v-if="temperatureCondition === '열대야'" class="weather-tag tropical"> 열대야 </span>

      <span v-else-if="temperatureCondition === '더위'" class="weather-tag hot"> 더위 </span>

      <span v-else-if="temperatureCondition === '선선함'" class="weather-tag cool"> 선선함 </span>

      <span v-else class="weather-tag cold"> 쌀쌀 </span>
    </div>

    <!-- 버튼 -->
    <div class="button-group">
      <button type="button" @click="selectCard">선택</button>

      <button type="button" @click="handleDetail">상세보기</button>
    </div>
  </div>
</template>

<style scoped>
.weather-card {
  margin: 10px 0;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.weather-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.card-header h4 {
  margin: 0;
  font-size: 16px;
}

.status {
  padding: 3px 8px;
  border-radius: 12px;
  background: #f1f2f6;
  font-size: 12px;
}

.temperature-area {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-top: 12px;
}

.temperature {
  font-size: 28px;
  line-height: 1;
}

.temperature-condition {
  font-size: 13px;
  color: #666;
}

.weather-tags {
  display: flex;
  gap: 6px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.weather-tag {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

.weather-tag.tropical {
  background: #ffe5e5;
  color: #d63031;
}

.weather-tag.hot {
  background: #fff0e1;
  color: #e67e22;
}

.weather-tag.cool {
  background: #e8f6ff;
  color: #2980b9;
}

.weather-tag.cold {
  background: #eaf0ff;
  color: #5c6bc0;
}

.button-group {
  display: flex;
  gap: 8px;
  margin-top: 14px;
}

.button-group button {
  flex: 1;
  padding: 7px 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: white;
  color: #333;
  cursor: pointer;
}

.button-group button:hover {
  background: #f5f5f5;
}
</style>
