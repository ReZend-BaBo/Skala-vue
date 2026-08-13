import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useMarketStore = defineStore('market', () => {
  const marketData = ref([
    {
      name: 'KOSPI',
      value: '6,773.92',
      change: '+2.96%',
      direction: 'up',
    },
    {
      name: 'KOSDAQ',
      value: '861.37',
      change: '+0.29%',
      direction: 'up',
    },
    {
      name: '원/달러',
      value: '1,421.90',
      change: '+0.20%',
      direction: 'up',
    },
    {
      name: 'NASDAQ',
      value: '26,588.49',
      change: '+0.54%',
      direction: 'up',
    },
  ])

  const marketSummary = computed(() => {
    const rising = marketData.value.filter((item) => item.direction === 'up').length

    const falling = marketData.value.filter((item) => item.direction === 'down').length

    return {
      rising,
      falling,
      text: `상승 ${rising} · 하락 ${falling}`,
    }
  })

  const updatedDate = ref('2026-08-13')

  const mockDataSets = [
    [
      {
        name: 'KOSPI',
        value: '6,773.92',
        change: '+2.96%',
        direction: 'up',
      },
      {
        name: 'KOSDAQ',
        value: '861.37',
        change: '+0.29%',
        direction: 'up',
      },
      {
        name: '원/달러',
        value: '1,421.90',
        change: '+0.20%',
        direction: 'up',
      },
      {
        name: 'NASDAQ',
        value: '26,588.49',
        change: '+0.54%',
        direction: 'up',
      },
    ],

    [
      {
        name: 'KOSPI',
        value: '6,801.24',
        change: '+0.41%',
        direction: 'up',
      },
      {
        name: 'KOSDAQ',
        value: '854.92',
        change: '-0.75%',
        direction: 'down',
      },
      {
        name: '원/달러',
        value: '1,418.30',
        change: '-0.25%',
        direction: 'down',
      },
      {
        name: 'NASDAQ',
        value: '26,642.18',
        change: '+0.20%',
        direction: 'up',
      },
    ],
  ]

  let currentDataSet = 0

  function refreshMarket() {
    currentDataSet = (currentDataSet + 1) % mockDataSets.length
    marketData.value = mockDataSets[currentDataSet]
  }

  return {
    marketData,
    marketSummary,
    updatedDate,
    refreshMarket,
  }
})
