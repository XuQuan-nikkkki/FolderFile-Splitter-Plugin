import { uniq } from "./array"

export const removeDuplicateFromObjValues = <T>(obj: Record<string, T[]>) => {
  const result = {} as Record<string, T[]>
  for (const key in obj) {
    const value = uniq(obj[key])
    result[key] = value
  }
  return result
}