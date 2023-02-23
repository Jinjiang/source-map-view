<script setup lang="ts">
import Code from './Code.vue'
import Footer from './Footer.vue'
import { map, generated } from '../composables/store'
</script>

<template>
  <div style="padding: 1.5em 2em; position: relative;">
    <h2>Generated File</h2>
    <Code v-if="generated" :id="generated.id" :content="generated.content" />
  </div>
  <div style="padding: 1.5em 2em 12em; position: relative;">
    <h2>Source Map File</h2>
    <Code v-if="map" :id="map.id" :content="map.content" />
    <Footer />
  </div>
</template>
