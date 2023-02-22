import { computed, reactive, ref } from "vue"
import { parse } from "./converter"
import { GEN_KEY, SRC_KEY, getMappingsMap, Position } from "./finder"

export type File = {
  id: string
  content: string
}

// input

export const sources = reactive<File[]>([])

export const generated = ref<File>()

export const map = ref<File>()

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

  const { mappings: mappingsString, files, names } = mapObject
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
