<script setup lang="ts">
import { rawMappings } from '../composables/store'
</script>

<template>
  <pre v-if="rawMappings">{{ rawMappings }}</pre>
</template>
