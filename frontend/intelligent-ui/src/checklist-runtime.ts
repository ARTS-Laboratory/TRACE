export function checklistStateFromRenderer(
  keys: { id: string; key: string }[],
  runtime: Record<string, unknown>,
): { checked: Record<string, boolean> } | null {
  const entries: [string, boolean][] = []
  for (const { id, key } of keys) {
    // Reactive bindings update $key. A simultaneous bare key can be stale.
    // Keep flat-key support for older/non-reactive snapshots only.
    const field = Object.hasOwn(runtime, `$${key}`) ? `$${key}` : key
    if (!Object.hasOwn(runtime, field) || typeof runtime[field] !== 'boolean') {
      return null
    }
    entries.push([id, runtime[field] as boolean])
  }
  return { checked: Object.fromEntries(entries) }
}
