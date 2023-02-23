<script setup lang="ts">
import Code from './Code.vue'
import { sources } from '../composables/store'
</script>

<template>
  <div style="padding: 1.5em 2em 12em;">
    <h2>Source Files</h2>
    <Code v-for="source in sources" :id="source.id" :content="source.content" />
  </div>
</template>
