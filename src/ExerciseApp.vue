<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import WeatherMockup from './components/exercise/WeatherMockup.vue'
import WeatherComposition from './components/exercise/WeatherComposition.vue'
import WeatherParent from './components/exercise/WeatherParent.vue'
import UnitToggler from './components/exercise/UnitToggler.vue'

const currentExercise = ref(1)

const router = useRouter()

const goToExercise4 = () => {
  const confirmed = window.confirm(
    '과제 1~3으로 다시 이동하려면 페이지를 다시 접속해야 합니다.\n\n' +
      '과제 4로 이동하시겠습니까?',
  )

  if (confirmed) {
    router.push('/exercise4')
  }
}
</script>

<template>
  <div class="exercise-tabs">
    <button :class="{ active: currentExercise === 1 }" @click="currentExercise = 1">과제 1</button>

    <button :class="{ active: currentExercise === 2 }" @click="currentExercise = 2">과제 2</button>

    <button :class="{ active: currentExercise === 3 }" @click="currentExercise = 3">과제 3</button>

    <button @click="goToExercise4">과제 4</button>

    <UnitToggler />
  </div>

  <div v-if="currentExercise === 1" class="app-container">
    <h1>과제 1: 날씨 (Mockup)</h1>
    <hr />
    <WeatherMockup />
  </div>

  <div v-else-if="currentExercise === 2" class="app-container">
    <h1>과제 2: 날씨 (컴포지션)</h1>
    <hr />
    <WeatherComposition />
  </div>

  <div v-else-if="currentExercise === 3" class="app-container">
    <h1>과제 3: 날씨</h1>
    <hr />
    <WeatherParent />
  </div>
</template>

<style scoped>
.exercise-tabs {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.exercise-tabs button {
  padding: 8px 20px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  color: black;
  font-size: 14px;
}

.exercise-tabs button.active {
  background: #3498db;
  color: white;
}
</style>
