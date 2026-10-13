export function errMsg(x: unknown): string {
  if (typeof x === 'object' && x !== null && 'message' in x) {
    return String((x as { message: unknown }).message)
  }
  return String(x)
}