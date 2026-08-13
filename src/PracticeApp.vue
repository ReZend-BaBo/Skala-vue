<script setup>
import { ref } from 'vue'
import SampleOne from './components/practices/basic/SampleOne.vue'
import SampleTwo from './components/practices/basic/SampleTwo.vue'
import TextInterpolation from './components/practices/basic/TextInterpolation.vue'
import Vbindgram from './components/practices/basic/V-bind-gram.vue'
import Vbindstyle from './components/practices/basic/V-bind-style.vue'
import Vbind from './components/practices/basic/V-bind.vue'
import Vclassbind from './components/practices/basic/V-class-bind.vue'
import Vcloak from './components/practices/basic/V-cloak.vue'
import Vfor from './components/practices/basic/V-for.vue'
import Vhtmlxss from './components/practices/basic/V-html-xss.vue'
import Vhtml from './components/practices/basic/V-html.vue'
import Vif from './components/practices/basic/V-if.vue'
import Vmemo from './components/practices/basic/V-memo.vue'
import Vonce from './components/practices/basic/V-once.vue'
import Vpre from './components/practices/basic/V-pre.vue'
import Vshow from './components/practices/basic/V-show.vue'
import Vtext from './components/practices/basic/V-text.vue'
import VEvent from './components/practices/basic/V-on-Event.vue'
import Evnet from './components/practices/basic/Evnet.vue'
import EventModifie from './components/practices/basic/Event-Modifie.vue'
import Vmodel from './components/practices/basic/V-model.vue'
import VForm from './components/practices/basic/VForm.vue'
import VmodelModifier from './components/practices/basic/V-model-Modifier.vue'
import VStyle from './components/practices/basic/VStyle.vue'
import VRef from './components/practices/basic/V-ref.vue'
import VReactive from './components/practices/basic/V-reactive.vue'
import Vcomputed from './components/practices/basic/V-computed.vue'
import Vwatch from './components/practices/basic/V-Watch.vue'
import VMulti from './components/practices/basic/V-Multi.vue'
import VDeep from './components/practices/basic/V-Deep.vue'
import VData from './components/practices/basic/V-Data.vue'
import VEffect from './components/practices/basic/V-Effect.vue'
import LifecycleParent from './components/practices/component/LifecycleParent.vue'
import PropsEmits from './components/practices/basic/PropsEmitP.vue'
import DefaultSlot from './components/practices/basic/DefaultP.vue'
import NamedSlot from './components/practices/basic/NamedP.vue'
import ScopedSlot from './components/practices/basic/ScopedP.vue'
import AxiosPractice from './views/WeatherAPI.vue'
</script>

<template>
  <div class="grid-container" style="padding: 20px">
    <div class="block-item"><SampleOne /></div>
    <div class="block-item"><SampleTwo /></div>
    <div class="block-item"><TextInterpolation /></div>
    <div class="block-item"><Vhtml /></div>
    <div class="block-item"><Vhtmlxss /></div>
    <div class="block-item"><Vtext /></div>
    <div class="block-item"><Vbind /></div>
    <div class="block-item"><Vclassbind /></div>
    <div class="block-item"><Vbindstyle /></div>
    <div class="block-item"><Vbindgram /></div>
    <div class="block-item"><Vif /></div>
    <div class="block-item"><Vshow /></div>
    <div class="block-item"><Vfor /></div>
    <div class="block-item"><Vpre /></div>
    <div class="block-item"><Vcloak /></div>
    <div class="block-item"><Vonce /></div>
    <div class="block-item"><Vmemo /></div>
    <div class="block-item"><VEvent /></div>
    <div class="block-item"><Evnet /></div>
    <div class="block-item"><EventModifie /></div>
    <div class="block-item"><Vmodel /></div>
    <div class="block-item"><VForm /></div>
    <div class="block-item"><VmodelModifier /></div>
    <div class="block-item"><VStyle /></div>
    <div class="block-item"><VRef /></div>
    <div class="block-item"><VReactive /></div>
    <div class="block-item"><Vcomputed /></div>
    <div class="block-item"><Vwatch /></div>
    <div class="block-item"><VMulti /></div>
    <div class="block-item"><VDeep /></div>
    <div class="block-item"><VData /></div>
    <div class="block-item"><VEffect /></div>
    <div class="block-item"><LifecycleParent /></div>
    <div class="block-item"><PropsEmits /></div>
    <div class="block-item"><DefaultSlot /></div>
    <div class="block-item"><NamedSlot /></div>
    <div class="block-item"><ScopedSlot /></div>
    <div class="block-item"><AxiosPractice /></div>
  </div>
</template>

<style>
.grid-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  padding: 20px;
}

.block-item {
  width: 100%;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  box-sizing: border-box;
}
</style>
