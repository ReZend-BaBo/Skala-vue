<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleGoHome = () => {
  router.push('/exercise4')
}
</script>

<template>
  <div class="about-page">
    <h3>ℹ️ 서비스 소개</h3>
    <hr />

    <div class="description-box">
      <p>
        본 앱은 <strong>Vue 3</strong> 및 <strong>Vue Router 4</strong> 기반으로 제작된 실습용 기상
        관측 대시보드 시스템입니다.
      </p>

      <ul>
        <li>components/exercise 폴더 내부의 독립 컴포넌트 연동</li>

        <li>클라이언트 사이드 라우팅을 통한 새로고침 없는 화면 전환</li>

        <li>도시 ID 기반 동적 라우팅을 통한 상세 기상 정보 제공</li>
      </ul>
    </div>

    <button @click="handleGoHome" class="home-btn">대시보드 홈으로 이동</button>
  </div>
</template>

<style scoped>
.about-page {
  width: 600px;
  margin: 0 auto;
}

.description-box {
  background-color: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  line-height: 1.5;
  font-size: 14px;
}

ul {
  padding-left: 20px;
  margin: 8px 0 0 0;
}

li {
  margin-bottom: 6px;
  color: #555;
}

.home-btn {
  width: 100%;
  margin-top: 15px;
  padding: 10px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}
</style>
