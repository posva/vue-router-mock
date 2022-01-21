import type { vi as Vi } from 'vitest'

declare const vi: typeof Vi | undefined

export function getVitestGlobal() {
  return typeof vi !== 'undefined' && vi
}
