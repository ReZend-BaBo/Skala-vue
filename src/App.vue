<script setup>
import PracticeApp from './PracticeApp.vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import UnitToggler from './components/exercise/UnitToggler.vue'

const MODE = 'E'
const route = useRoute()
</script>

<template>
  <v-app>
    <PracticeApp v-if="MODE === 'P'" />

    <template v-else>
      <!-- 과제 4 영역에서만 표시되는 Navigation Bar -->
      <nav v-if="route.meta.weatherNav" class="weather-nav">
        <div class="nav-links">
          <RouterLink to="/exercise4"> 날씨 대시보드 </RouterLink>

          <RouterLink to="/exercise4/about"> 서비스 소개 </RouterLink>
        </div>

        <!-- 단위 변경 -->
        <UnitToggler />
      </nav>

      <RouterView />
    </template>
  </v-app>
</template>

<style scoped>
.weather-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.nav-links {
  display: flex;
  gap: 10px;
}

.weather-nav a {
  padding: 8px 20px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  color: black;
  text-decoration: none;
  font-size: 14px;
}

.weather-nav a.router-link-active {
  background: #3498db;
  color: white;
}
</style>
