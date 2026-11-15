/* eslint-disable react-refresh/only-export-components -- This entry exports a browser embedding API, not a Fast Refresh boundary. */
import { Component, useCallback, useState } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import type { Root } from 'react-dom/client'
import { Renderer } from '@openuidev/react-lang'
import type { OpenUIError } from '@openuidev/react-lang'
import { library, checklistLibrary } from './visual-library'
import { savedVisualToOptions, checklistStateFromRenderer } from './saved-spec'
import './interaction-state.css'
import { chartLibrary } from './chart-library'
import { comparisonLibrary } from './comparison-library'
import { flowchartLibrary } from './flowchart-library'
import { statusLibrary } from './status-library'

export type VisualOptions = {
  kind: 'table' | 'checklist' | 'chart' | 'comparison' | 'flowchart' | 'status'
  response: string
  initialState?: Record<string, unknown>
  onStateUpdate?: (state: Record<string, unknown>) => void
}

const roots = new WeakMap<HTMLElement, Root>()
const libraries = { table: library, checklist: checklistLibrary, chart: chartLibrary, comparison: comparisonLibrary, flowchart: flowchartLibrary, status: statusLibrary }

class VisualBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Visual component failed:', error, info)
  }

  render() {
    return this.state.failed
      ? <p role="alert">This visual could not be displayed.</p>
      : this.props.children
  }
}

function VisualContent({ options }: { options: VisualOptions }) {
  const [error, setError] = useState('')
  const onError = useCallback((errors: OpenUIError[]) => {
    const failures = errors.filter(item => item.severity !== 'warning')
    setError(failures.length ? 'This visual could not be displayed.' : '')
    if (failures.length) console.error('OpenUI errors:', failures)
  }, [])

  return (
    <>
      {error && <p role="alert">{error}</p>}
      <div hidden={Boolean(error)}>
        <Renderer
          library={libraries[options.kind]}
          response={options.response}
          initialState={options.initialState}
          onStateUpdate={options.onStateUpdate}
          isStreaming={false}
          onError={onError}
        />
      </div>
    </>
  )
}

// The host owns the outer element; React owns only its children.
export function mountVisual(element: HTMLElement, options: VisualOptions) {
  if (!['table', 'checklist', 'chart', 'comparison', 'flowchart', 'status'].includes(options.kind)
      || typeof options.response !== 'string') {
    throw new Error('Unsupported renderer input')
  }
  let root = roots.get(element)
  if (!root) {
    element.replaceChildren()
    element.classList.add('gc-visual')
    root = createRoot(element)
    roots.set(element, root)
  }
  root.render(
    <VisualBoundary key={options.kind + ':' + options.response}>
      <VisualContent options={options} />
    </VisualBoundary>,
  )
}

export function unmountVisual(element: HTMLElement) {
  const root = roots.get(element)
  if (!root) return
  root.unmount()
  roots.delete(element)
  element.classList.remove('gc-visual')
}

// HTTP data enters only through this validating adapter.
export function mountSavedVisual(
  element: HTMLElement,
  payload: unknown,
  onStateUpdate?: (state: Record<string, unknown>) => void,
) {
  const options = savedVisualToOptions(payload)
  if (options.kind !== 'checklist') {
    mountVisual(element, options)
    return
  }
  // Ignore hydration callbacks and incomplete snapshots; only changed selections save.
  let previous = JSON.stringify(checklistStateFromRenderer(options.checklistKeys, options.initialState))
  mountVisual(element, {
    ...options,
    onStateUpdate: runtimeState => {
      const state = checklistStateFromRenderer(options.checklistKeys, runtimeState)
      if (!state) return
      const serialized = JSON.stringify(state)
      if (serialized === previous) return
      previous = serialized
      onStateUpdate?.(state)
    },
  })
}
