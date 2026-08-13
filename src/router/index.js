import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    // 기존 과제 1~3
    {
      path: '/',
      name: 'home',
      component: () => import('../ExerciseApp.vue'),
    },

    // 과제 4 메인
    {
      path: '/exercise4',
      name: 'exercise4',
      component: () => import('../views/WeatherHomeView.vue'),
      meta: {
        weatherNav: true,
      },
    },

    // 과제 4 서비스 소개
    {
      path: '/exercise4/about',
      name: 'about',
      component: () => import('../views/WeatherAboutView.vue'),
      meta: {
        weatherNav: true,
      },
    },

    // 지역별 상세 페이지
    {
      path: '/weather/:cityId',
      name: 'weather-detail',
      component: () => import('../views/WeatherDetailView.vue'),
      meta: {
        weatherNav: true,
      },
    },

    // Catch-all
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
    {
      path: '/market',
      name: 'market',
      component: () => import('../views/MarketView.vue'),
    },
  ],
})

export default router
