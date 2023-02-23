import type { File } from "./gist"

import { computed, reactive, ref } from "vue"
import { parse } from "./converter"
import { GEN_KEY, SRC_KEY, getMappingsMap, Position } from "./finder"
import { getGistFiles, init as initGistApi } from "./gist"

// input

const DEMO_GIST_HASH = "e8cc87f03acb0b9e80b48ebeca1a0520"

export const sources = reactive<File[]>([])

export const generated = ref<File>()

export const map = ref<File>()

export const init = async () => {
  await initGistApi()

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
}

// state

export const currentMappingIndex = ref(-1)

// computed output

export const mappings = computed<Map<string | typeof SRC_KEY | typeof GEN_KEY, Position[]>>(() => {
  const mapContent = map.value?.content
  const generatedId = generated.value?.id ?? ""
  const sourceIds = sources.map(source => source.id)
  const mapObject = JSON.parse(mapContent || "null")

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
