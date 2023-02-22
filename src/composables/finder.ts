import type { MapInfo } from './converter'

export type Position = {
  file?: string
  name?: string
  line: number
  column: number
  index?: number
}

export const SRC_KEY = Symbol("src")
export const GEN_KEY = Symbol("gen")

export type MappingsMap = Map<string | typeof SRC_KEY | typeof GEN_KEY, Position[]>

export const getMappingsMap = (mapInfo: MapInfo, sources: string[], generated: string): MappingsMap => {
  const mappingsMap = new Map<string | typeof SRC_KEY | typeof GEN_KEY, Position[]>()

  mappingsMap.set(SRC_KEY, [])
  mappingsMap.set(GEN_KEY, [])
  mappingsMap.set(generated, [])
  sources.forEach(source => mappingsMap.set(source, []))

  let index = 0
  mapInfo.forEach(line => {
    line.forEach(point => {
      const srcPosition: Position = {
        file: point.source,
        name: point.name,
        line: point.original.line,
        column: point.original.column,
        index,
      }
      const genPosition: Position = {
        name: point.name,
        file: generated,
        line: point.generated.line,
        column: point.generated.column,
        index,
      }

      if (point.source) {
        mappingsMap.get(point.source)?.push(srcPosition)
      }
      mappingsMap.get(SRC_KEY)!.push(srcPosition)
      mappingsMap.get(generated)!.push(genPosition)
      mappingsMap.get(GEN_KEY)!.push(genPosition)
      index++
    })
  })
  return mappingsMap
}

export const findGeneratedPosition = (position: Position, mappingsMap: MappingsMap): Position | undefined => {
  const genMappings = mappingsMap.get(GEN_KEY) ?? []
  const srcMappings = mappingsMap.get(SRC_KEY) ?? []
  const genPosition = genMappings.find(genPosition => {
    return genPosition.line === position.line && (
      genPosition.column === position.column
      || position.column > genPosition.column
        && position.column <= genPosition.column + (genPosition.name?.length ?? 0)
    )
  })
  return srcMappings[genPosition?.index ?? -1]
}

export const findOriginalPosition = (position: Position, mappingsMap: MappingsMap): Position | undefined => {
  const srcMappings = mappingsMap.get(SRC_KEY) ?? []
  const genMappings = mappingsMap.get(GEN_KEY) ?? []
  const srcPosition = srcMappings.find(srcPosition => {
    return srcPosition.line === position.line && (
      srcPosition.column === position.column
      || position.column > srcPosition.column
        && position.column <= srcPosition.column + (srcPosition.name?.length ?? 0)
    )
  })
  return genMappings[srcPosition?.index ?? -1]
}
