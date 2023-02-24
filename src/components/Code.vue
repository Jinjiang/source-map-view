<script setup lang="ts">
import { ref, computed } from 'vue';
import { mappings, currentMappingIndex } from '../composables/store'

const { id, content } = defineProps<{
  id: string
  content: string
}>()

type Token = {
  index: number
  value: string
}
type RichLine = (string | Token)[]
type RichContent = RichLine[]

const wrap = ref(false)

const richContent = computed<RichContent>(() => {
  const lines: string[] = content.split('\n')
  const richLines: RichContent = lines.map(x => x.split(''))
  const positions = mappings.value.get(id) ?? []
  for (let i = positions.length - 1; i >= 0; i--) {
    const { index, name, line, column } = positions[i]
    if (typeof index !== 'number') {
      continue
    }
    const token: Token = {
      index,
      value: lines[line][column],
      // value: name && name === lines[line].slice(column, name.length)
      //   ? name
      //   : lines[line][column],
    }

    const richLine = richLines[line]
    richLine[column] = token
    // richLine.splice(column, token.value.length, token)
  }
  return richLines
})
</script>

<template>
  <a href="#" style="float: right;" @click.prevent="wrap = !wrap">word wrap: {{ wrap ? 'on' : 'off' }}</a>
  <h3>{{ id }}</h3>
  <div class="code-block" :class="wrap ? 'break-all' : 'keep-all'">
    <code>
      <template v-for="line in richContent">
        <template v-for="token in line">
          <span v-if="typeof token === 'object'" :class="currentMappingIndex === token.index ? 'token highlighted' : 'token'" @click="currentMappingIndex = token.index">{{ token.value }}</span>
          <span v-else>{{ token }}</span>
        </template>
        <br />
      </template>
    </code>
  </div>
</template>

<style scoped>
.code-block {
  position: relative; left: 0; right: 0; overflow-x: auto;
}
.keep-all {
  white-space: nowrap;
}
.break-all {
  word-break: break-all;
}

.token {
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.1);
}

.highlighted {
  color: InfoText;
  background-color: InfoBackground;
}

span {
  /* pre */
  white-space: pre;
}
</style>
