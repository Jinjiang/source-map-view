<!-- App: welcome, split pane (sources, generated + map), bottom pane mappings -->

<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import {
  init,
  sources,
  generated,
  map,
} from './composables/store'

// testing purposes
init()
</script>

<template>
  <HelloWorld v-if="!map" />
  <div v-for="source in sources">
    <h3>{{ source.id }}</h3>
    <pre>{{ source.content }}</pre>
  </div>
  <div v-if="map">
    <h3>{{ map.id }}</h3>
    <pre>{{ map.content }}</pre>
  </div>
  <div v-if="generated">
    <h3>{{ generated.id }}</h3>
    <pre>{{ generated.content }}</pre>
  </div>
</template>
