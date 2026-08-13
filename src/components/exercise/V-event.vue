<script setup>
const props = defineProps({
  cityName: String,
  status: String,
})

const showDetail = () => {
  window.alert(`${props.cityName}의 현재 날씨는 [${props.status}] 상태입니다.`)
}
</script>

<template>
  <button @click.stop="showDetail">상세보기</button>
</template>
