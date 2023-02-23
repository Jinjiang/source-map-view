import type { File } from "./gist"

import { computed, reactive, ref } from "vue"
import { parse } from "./converter"
import { GEN_KEY, SRC_KEY, getMappingsMap, Position } from "./finder"
import { getGistFiles, initAccessToken } from "./gist"

// state

export const loading = ref(true)

export const currentMappingIndex = ref(-1)

// input

const DEMO_GIST_HASH = "e8cc87f03acb0b9e80b48ebeca1a0520"

export const sources = reactive<File[]>([])

export const generated = ref<File>()

export const map = ref<File>()

export const init = async () => {
  loading.value = true

  await initAccessToken()

  const hash = window.location.hash.slice(1) || DEMO_GIST_HASH
  const files = await getGistFiles(hash)

  const mapFile = files.find(file => file.id.endsWith(".map"))
  map.value = mapFile

  const generatedFileName = JSON.parse(mapFile?.content ?? "null")?.file
  generated.value = files.find(file => file.id === generatedFileName)
  files.forEach(file => {
    if (file.id !== mapFile?.id && file.id !== generatedFileName) {
      sources.push(file)
    }
  })

  loading.value = false
}

export const setHash = async (hash: string) => {
  window.location.hash = hash
  await init()
}

// computed output

export const rawMappings = computed(() => {
  const mapContent = map.value?.content
  const mapObject = JSON.parse(mapContent || "null")
  return mapObject
})

export const mappings = computed<Map<string | typeof SRC_KEY | typeof GEN_KEY, Position[]>>(() => {
  const mapObject = rawMappings.value
  const generatedId = generated.value?.id ?? ""
  const sourceIds = sources.map(source => source.id)

  if (!mapObject) {
    return new Map()
  }

  const { mappings: mappingsString, sources: files, names } = mapObject
  const parsedResult = parse(mappingsString, files, names)

  return getMappingsMap(parsedResult, sourceIds, generatedId)
})

export const currentMapping = computed<{ source?: Position, generated?: Position} | undefined>(() => {
  const mappingsValue = mappings.value
  const indexValue = currentMappingIndex.value
  const srcMappings = mappingsValue.get(SRC_KEY) ?? []
  const genMappings = mappingsValue.get(GEN_KEY) ?? []
  if (indexValue < 0) {
    return
  }
  return {
    source: srcMappings[indexValue],
    generated: genMappings[indexValue],
  }
})
