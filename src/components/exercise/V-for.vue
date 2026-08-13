<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Vif from './V-if.vue'
import Vevent from './V-event.vue'
import { weatherList } from './data/weather.js'

const currentPage = ref(0)

const visibleWeatherList = computed(() => {
  const sortedList = [...weatherList].sort((a, b) => {
    const numA = Number(a.id.replace('city_', ''))
    const numB = Number(b.id.replace('city_', ''))

    return numA - numB
  })

  const start = currentPage.value * 4

  return sortedList.slice(start, start + 4)
})

const selectedMessage = ref('지역을 선택해주세요.')

const selectCity = (cityName) => {
  selectedMessage.value = `${cityName}이 선택되었습니다.`
}

let timer

onMounted(() => {
  timer = setInterval(() => {
    currentPage.value = (currentPage.value + 1) % 4
  }, 20000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>
  <div class="weather-container">
    <div class="status-bar">
      {{ selectedMessage }}
    </div>

    <div class="weather-grid">
      <div
        v-for="item in visibleWeatherList"
        :key="item.id"
        class="weather-card"
        @click="selectCity(item.name)"
      >
        <h3>{{ item.name }}</h3>

        <div class="weather-info">
          <p class="temperature">{{ item.temp }}℃</p>
          <p>{{ item.status }}</p>
        </div>

        <div class="weather-info">
          <Vif :temp="item.temp" />
          <p>습도 {{ item.humidity }}%</p>
        </div>

        <Vevent :city-name="item.name" :status="item.status" />
      </div>
    </div>
  </div>
</template>
