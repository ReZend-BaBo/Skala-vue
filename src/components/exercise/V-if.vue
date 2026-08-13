<script setup>
defineProps({
  temp: Number
})
</script>

<template>
  <p v-if="temp >= 30">🔥 열대야</p>
  <p v-else-if="temp >= 25">☀️ 더움</p>
  <p v-else-if="temp >= 20">🌤️ 시원</p>
  <p v-else>❄️ 추위</p>
</template>
