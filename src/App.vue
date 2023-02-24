<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import SplitPane from './components/SplitPane.vue';
import Sources from './components/Sources.vue'
import Generated from './components/Generated.vue'
import { init, map, loading } from './composables/store'

init()
</script>

<template>
  <div class="app">
    <SplitPane v-if="!loading && map">
      <template #left>
        <Sources />
      </template>
      <template #right>
        <Generated />
      </template>
    </SplitPane>
    <HelloWorld v-else />
  </div>
</template>

<style>
body {
  overflow: hidden;
  margin: 0 auto;
}
</style>

<style scoped>
.app {
  --bg: #fff;
  --bg-soft: #f8f8f8;
  --border: #ddd;
  --text-light: #888;
  --font-code: Menlo, Monaco, Consolas, 'Courier New', monospace;
  --color-branding: #42b883;
  --color-branding-dark: #416f9c;
  --header-height: 38px;

  font-size: 13px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  margin: 0;
  height: 100vh;
  overflow: hidden;
  background-color: var(--bg-soft);
}

.dark .app {
  --bg: #1a1a1a;
  --bg-soft: #242424;
  --border: #383838;
  --text-light: #aaa;
  --color-branding: #42d392;
  --color-branding-dark: #89ddff;
}

:deep(button) {
  border: none;
  outline: none;
  cursor: pointer;
  margin: 0;
  background-color: transparent;
}
</style>
