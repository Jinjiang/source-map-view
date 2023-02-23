<script setup lang="ts">
import { computed } from 'vue';
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

// TODO: debug
const richContent = computed<RichContent>(() => {
  const lines: string[] = content.split('\n')
  const richLines: RichContent = lines.map(x => [x])
  const positions = mappings.value.get(id) ?? []
  for (let i = positions.length - 1; i >= 0; i--) {
    const { index, name, line, column } = positions[i]
    if (typeof index !== 'number') {
      continue
    }
    const token: Token = {
      index,
      value: name ? name : lines[line][column],
    }
    const richLine = richLines[line]
    const firstString = richLine[0]
    if (typeof firstString !== 'string') {
      continue
    }
    const subRichLine: RichLine = [firstString.slice(0, column), token, firstString.slice(column + token.value.length)].filter(Boolean)
    richLine.splice(0, 1, ...subRichLine)
  }
  return richLines
})
</script>

<template>
  <h3>{{ id }}</h3>
  <div style="position: relative; left: 0; right: 0; overflow-x: auto;">
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
.token {
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.1);
}

.highlighted {
  background-color: #ffff00;
}

span {
  /* pre */
  white-space: pre;
}
</style>
