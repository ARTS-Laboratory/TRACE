import { graphlib, layout } from '@dagrejs/dagre'

type Point = { x: number; y: number }
type NodeInput = { id: string; label: string }
type EdgeInput = { source: string; target: string; label: string }
type PositionedNode = Point & { width: number; height: number }
type PositionedEdge = Point & { points: Point[] }

// Approximate monospace character widths; the full text is also listed below SVG.
export function wrapFlowText(text: string, columns = 26): string[] {
  return text.split(/\r?\n/).flatMap(line => {
    const characters = Array.from(line)
    if (!characters.length) return ['']
    const lines: string[] = []
    for (let i = 0; i < characters.length; i += columns) {
      lines.push(characters.slice(i, i + columns).join(''))
    }
    return lines
  })
}

export function layoutFlowchart(direction: 'TD' | 'LR', nodes: NodeInput[], edges: EdgeInput[]) {
  const graph = new graphlib.Graph({ multigraph: true })
  graph.setGraph({ rankdir: direction === 'TD' ? 'TB' : 'LR', nodesep: 50, ranksep: 70, edgesep: 22, marginx: 30, marginy: 30 })
  // Internal IDs keep arbitrary user IDs out of the layout library's keys.
  const internalIds = new Map(nodes.map((node, i) => [node.id, `node${i}`]))
  nodes.forEach((node, i) => {
    graph.setNode(`node${i}`, { width: 250, height: wrapFlowText(node.label).length * 20 + 28 })
  })
  edges.forEach((edge, i) => {
    const source = internalIds.get(edge.source)
    const target = internalIds.get(edge.target)
    if (source === undefined || target === undefined) throw new Error('Unknown flowchart node')
    const lines = edge.label ? wrapFlowText(edge.label, 22) : []
    graph.setEdge(source, target, {
      width: lines.length ? Math.max(...lines.map(line => Array.from(line).length)) * 8 + 16 : 0,
      height: lines.length ? lines.length * 18 + 12 : 0,
      labelpos: 'c',
    }, `edge${i}`)
  })
  layout(graph)
  const size = graph.graph()
  const positionedNodes = nodes.map((node, i) => ({
    ...node,
    ...(graph.node(`node${i}`) as PositionedNode),
    lines: wrapFlowText(node.label),
  }))
  const positionedEdges = edges.map((edge, i) => ({
    ...edge,
    ...(graph.edge(internalIds.get(edge.source)!, internalIds.get(edge.target)!, `edge${i}`) as PositionedEdge),
    lines: edge.label ? wrapFlowText(edge.label, 22) : [],
  }))
  if (!Number.isFinite(size.width) || !Number.isFinite(size.height)) throw new Error('Invalid flowchart layout')
  return { width: size.width as number, height: size.height as number, nodes: positionedNodes, edges: positionedEdges }
}
