import { z } from 'zod/v4'

export { checklistStateFromRenderer } from './checklist-runtime.ts'

const savedStateSchema = z.object({
  // Validate entries separately so arbitrary item IDs remain ordinary data.
  checked: z.unknown().optional(),
}).strict()

const checkedEntriesSchema = z.array(z.tuple([z.string().min(1), z.boolean()]))

export function readChecklistState(input: unknown, ids: string[]) {
  const state = savedStateSchema.parse(input === undefined ? {} : input)
  const checked = Object.hasOwn(state, 'checked') ? state.checked : {}
  if (typeof checked !== 'object' || checked === null || Array.isArray(checked)) {
    throw new Error('Invalid saved checklist selections')
  }
  const entries = checkedEntriesSchema.parse(Object.entries(checked))
  const valid = new Set(ids)
  if (entries.some(([id]) => !valid.has(id))) {
    throw new Error('Saved checklist state contains unknown item IDs')
  }
  return Object.fromEntries(entries)
}

