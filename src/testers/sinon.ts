import type { SinonStatic } from 'sinon'

declare const sinon: SinonStatic | undefined

export function getSinonGlobal() {
  return typeof sinon !== 'undefined' && sinon
}
