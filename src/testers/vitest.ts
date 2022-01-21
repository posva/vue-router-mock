// cannot import the actual typ
declare const vi: typeof jest

export function getVitestGlobal() {
  return typeof vi !== 'undefined' && vi
}
