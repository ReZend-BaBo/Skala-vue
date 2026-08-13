<script setup>
import { ref } from 'vue'
import { weatherList } from './data/weather.js'

const inputValue = ref('')
const searchResult = ref(null)
const searchedCity = ref('')

const searchCity = () => {
  const cityName = inputValue.value.trim()

  inputValue.value = cityName
  searchedCity.value = cityName

  const city = weatherList.find((item) => item.name === cityName)

  searchResult.value = city || null
}
</script>

<template>
  <div class="search-box">
    <input
      :value="inputValue"
      @input="inputValue = $event.target.value"
      @keyup.enter="searchCity"
      placeholder="한글로 입력해주세요."
    />

    <div v-if="searchedCity">
      <p>입력한 도시: {{ searchedCity }}</p>

      <div v-if="searchResult">
        <p>
          {{ searchResult.name }}의 날씨는 {{ searchResult.temp }}℃,
          {{ searchResult.status }}입니다.
        </p>
      </div>

      <p v-else>검색 결과가 없습니다.</p>
    </div>
  </div>
</template>
