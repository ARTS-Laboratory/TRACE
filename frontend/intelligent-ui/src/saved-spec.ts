import { z } from 'zod/v4'
import { readChecklistState, checklistStateFromRenderer } from './checklist-state.ts'

export { checklistStateFromRenderer }

const nonemptyText = z.string().trim().min(1)
const checklistSpecSchema = z.object({
  type: z.literal('checklist'),
  title: nonemptyText,
  checklist_items: z.array(z.object({
    id: nonemptyText,
    label: nonemptyText,
  }).strict()).min(1).max(50),
}).strict().superRefine((spec, context) => {
  const ids = spec.checklist_items.map(item => item.id)
  if (new Set(ids).size !== ids.length) {
    context.addIssue({
      code: 'custom',
      path: ['checklist_items'],
      message: 'Checklist item IDs must be unique',
    })
  }
})

const tableSpecSchema = z.object({
  type: z.literal('table'),
  title: nonemptyText,
  columns: z.array(nonemptyText).min(1).max(12),
  // Blank cells are valid, but every cell must still be a string.
  rows: z.array(z.array(z.string().trim())).min(1).max(100),
}).strict().superRefine((spec, context) => {
  spec.rows.forEach((row, index) => {
    if (row.length !== spec.columns.length) {
      context.addIssue({
        code: 'custom',
        path: ['rows', index],
        message: `Row ${index + 1} must contain ${spec.columns.length} cells`,
      })
    }
  })
})

export const chartSpecSchema = z.object({
  type: z.literal('chart'),
  chart_type: z.enum(['bar', 'line']),
  title: nonemptyText,
  labels: z.array(nonemptyText).min(1).max(100),
  series: z.array(z.object({
    name: nonemptyText,
    values: z.array(z.number().finite()).min(1).max(100),
  }).strict()).min(1).max(6),
}).strict().superRefine((spec, context) => {
  spec.series.forEach((series, index) => {
    if (series.values.length !== spec.labels.length) {
      context.addIssue({
        code: 'custom',
        path: ['series', index, 'values'],
        message: 'Each series must have one value per label',
      })
    }
  })
})

export const comparisonSpecSchema = z.object({
  type: z.literal('comparison'),
  title: nonemptyText,
  criteria: z.array(nonemptyText).min(1).max(12),
  options: z.array(z.object({
    name: nonemptyText,
    values: z.array(z.string().trim()).min(1).max(12),
  }).strict()).min(2).max(4),
}).strict().superRefine((spec, context) => {
  spec.options.forEach((option, index) => {
    if (option.values.length !== spec.criteria.length) {
      context.addIssue({
        code: 'custom',
        path: ['options', index, 'values'],
        message: 'Each option must have one value per criterion.',
      })
    }
  })
})

export const flowchartSpecSchema = z.object({
  type: z.literal('flowchart'),
  title: nonemptyText,
  direction: z.enum(['TD', 'LR']).default('TD'),
  nodes: z.array(z.object({
    id: nonemptyText,
    label: nonemptyText,
  }).strict()).min(1).max(30),
  edges: z.array(z.object({
    source: nonemptyText,
    target: nonemptyText,
    label: z.string().trim().default(''),
  }).strict()).max(60),
}).strict().superRefine((spec, context) => {
  const ids = new Set(spec.nodes.map(node => node.id))
  if (ids.size !== spec.nodes.length) {
    context.addIssue({ code: 'custom', path: ['nodes'], message: 'Flowchart node IDs must be unique.' })
  }
  spec.edges.forEach((edge, index) => {
    for (const field of ['source', 'target'] as const) {
      if (!ids.has(edge[field])) {
        context.addIssue({ code: 'custom', path: ['edges', index, field], message: `Unknown ${field} node ID: ${edge[field]}` })
      }
    }
  })
})

export const statusSpecSchema = z.object({
  type: z.literal('status'),
  title: nonemptyText,
  status_items: z.array(z.object({
    label: nonemptyText,
    state: z.enum(['pending', 'in_progress', 'success', 'warning', 'error']),
    detail: z.string().trim().default(''),
  }).strict()).min(1).max(20),
}).strict()

// Accept old saved checklists without rewriting their stored specifications.
// Reject payloads containing both names through the strict canonical schema.
function normalizeLegacyChecklist(input: unknown) {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) return input
  const spec = input as Record<string, unknown>
  if (spec.type !== 'checklist' || !Object.hasOwn(spec, 'items')
      || Object.hasOwn(spec, 'checklist_items')) return input
  const { items, ...rest } = spec
  return { ...rest, checklist_items: items }
}

const savedVisualSchema = z.object({
  id: z.number().int().positive(),
  schema_version: z.literal(1),
  state: z.unknown().optional(),
  spec: z.preprocess(normalizeLegacyChecklist, z.discriminatedUnion('type', [checklistSpecSchema, tableSpecSchema, chartSpecSchema, comparisonSpecSchema, flowchartSpecSchema, statusSpecSchema])),
})

// A stable, identifier-safe key, even when an ID has spaces or punctuation.
function stateKey(id: string) {
  return 'checked_' + id.split('')
    .map(character => character.charCodeAt(0).toString(16)).join('_')
}

export function savedVisualToOptions(payload: unknown) {
  const visual = savedVisualSchema.parse(payload)
  const { spec } = visual
  if (spec.type === 'status') {
    return {
      kind: 'status' as const,
      response: `root = DataStatus(${JSON.stringify(spec.title)}, ${JSON.stringify(spec.status_items)})`,
    }
  }
  if (spec.type === 'flowchart') {
    return {
      kind: 'flowchart' as const,
      response: `root = DataFlowchart(${JSON.stringify(spec.title)}, ${JSON.stringify(spec.direction)}, ${JSON.stringify(spec.nodes)}, ${JSON.stringify(spec.edges)})`,
    }
  }
  if (spec.type === 'comparison') {
    return {
      kind: 'comparison' as const,
      response: `root = DataComparison(${JSON.stringify(spec.title)}, ${JSON.stringify(spec.criteria)}, ${JSON.stringify(spec.options)})`,
    }
  }
  if (spec.type === 'chart') {
    return {
      kind: 'chart' as const,
      response: `root = DataChart(${JSON.stringify(spec.title)}, ${JSON.stringify(spec.chart_type)}, ${JSON.stringify(spec.labels)}, ${JSON.stringify(spec.series)})`,
    }
  }
  if (spec.type === 'table') {
    return {
      kind: 'table' as const,
      response: `root = DataTable(${JSON.stringify(spec.title)}, ${JSON.stringify(spec.columns)}, ${JSON.stringify(spec.rows)})`,
    }
  }
  const checked = readChecklistState(visual.state, spec.checklist_items.map(item => item.id))
  const checklistKeys = spec.checklist_items.map(item => ({ id: item.id, key: stateKey(item.id) }))
  const initialState: Record<string, unknown> = Object.fromEntries(
    checklistKeys.map(({ id, key }) => [`$${key}`, Object.hasOwn(checked, id) ? checked[id] : false]),
  )
  const references = spec.checklist_items.map((_, index) => `item${index}`)
  const lines = [
    `root = Checklist(${JSON.stringify(spec.title)}, [${references.join(', ')}])`,
  ]
  spec.checklist_items.forEach((item, index) => {
    const key = stateKey(item.id)
    lines.push(`$${key} = ${initialState[`$${key}`] === true}`)
    // Only fixed component calls are emitted. Model-supplied text is quoted data.
    lines.push(`item${index} = ChecklistItem(${JSON.stringify(key)}, ${JSON.stringify(item.label)}, $${key})`)
  })
  return { kind: 'checklist' as const, response: lines.join('\n'), initialState, checklistKeys }
}
