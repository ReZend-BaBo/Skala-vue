<script setup>
import { useMarketStore } from '@/stores/marketStore'

const marketStore = useMarketStore()
</script>

<template>
  <aside class="market-panel">
    <div class="panel-header">
      <div>
        <h3>시장 현황</h3>
        <span>{{ marketStore.updatedDate }} 기준</span>
      </div>

      <button class="refresh-btn" @click="marketStore.refreshMarket">↻</button>
    </div>

    <div v-for="item in marketStore.marketData" :key="item.name" class="market-item">
      <div class="market-name">
        {{ item.name }}
      </div>

      <div class="market-value">
        {{ item.value }}
      </div>

      <div class="market-change" :class="item.direction">
        {{ item.direction === 'up' ? '▲' : '▼' }}
        {{ item.change }}
      </div>
    </div>

    <div class="market-summary">
      <span>시장 분위기</span>
      <strong>{{ marketStore.marketSummary.text }}</strong>
    </div>

    <div class="market-footer">실습용 Mock Data</div>
  </aside>
</template>

<style scoped>
.market-panel {
  width: 220px;
  flex-shrink: 0;

  position: sticky;
  top: 20px;

  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 15px;
  box-sizing: border-box;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
}

.panel-header span {
  display: block;
  margin-top: 3px;
  font-size: 10px;
  color: #999;
}

.refresh-btn {
  width: 28px;
  height: 28px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: white;
  cursor: pointer;
  font-size: 16px;
}

.market-item {
  padding: 11px 0;
  border-bottom: 1px solid #f0f0f0;
}

.market-item:last-of-type {
  border-bottom: none;
}

.market-name {
  font-size: 12px;
  color: #777;
  margin-bottom: 4px;
}

.market-value {
  font-size: 17px;
  font-weight: bold;
}

.market-change {
  margin-top: 3px;
  font-size: 12px;
  font-weight: 600;
}

.market-change.up {
  color: #e74c3c;
}

.market-change.down {
  color: #3498db;
}

.market-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid #eee;
  font-size: 11px;
}

.market-summary span {
  color: #777;
}

.market-summary strong {
  font-size: 11px;
}

.market-footer {
  margin-top: 10px;
  text-align: right;
  font-size: 10px;
  color: #aaa;
}
</style>
