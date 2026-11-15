import { useId, useMemo } from 'react'
import { createLibrary, defineComponent } from '@openuidev/react-lang'
import { z } from 'zod/v4'
import { flowchartSpecSchema } from './saved-spec'
import { layoutFlowchart } from './flowchart-layout'
import './flowchart.css'

const DataFlowchart = defineComponent({
  name: 'DataFlowchart',
  description: 'Displays labeled nodes and directed connections.',
  props: z.object({
    title: flowchartSpecSchema.shape.title,
    direction: flowchartSpecSchema.shape.direction,
    nodes: flowchartSpecSchema.shape.nodes,
    edges: flowchartSpecSchema.shape.edges,
  }),
  component: function FlowchartView({ props }) {
    const markerId = 'flowArrow' + useId().replace(/[^a-zA-Z0-9_-]/g, '')
    const drawing = useMemo(
      () => layoutFlowchart(props.direction, props.nodes, props.edges),
      [props.direction, props.nodes, props.edges],
    )
    const names = new Map(props.nodes.map(node => [node.id, node.label]))
    return (
      <figure className="gc-flowchart">
        <figcaption>{props.title}</figcaption>
        <div className="gc-flowchart-scroll" role="region" aria-label={`${props.title} diagram`} tabIndex={0}>
          <svg width={drawing.width} height={drawing.height} viewBox={`0 0 ${drawing.width} ${drawing.height}`} role="img" aria-label={props.title}>
            <title>{props.title}</title>
            <desc>A directed flowchart. Full node and connection text is available under View flowchart details.</desc>
            <defs>
              <marker id={markerId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#8b9dff" />
              </marker>
            </defs>
            {drawing.edges.map((edge, i) => (
              <polyline key={i} className="gc-flowchart-edge" points={edge.points.map(p => `${p.x},${p.y}`).join(' ')} markerEnd={`url(#${markerId})`} />
            ))}
            {drawing.edges.map((edge, i) => edge.lines.length > 0 && (
              <g key={i} transform={`translate(${edge.x},${edge.y})`} className="gc-flowchart-label">
                <rect x={-(Math.max(...edge.lines.map(line => Array.from(line).length)) * 8 + 16) / 2} y={-(edge.lines.length * 18 + 12) / 2} width={Math.max(...edge.lines.map(line => Array.from(line).length)) * 8 + 16} height={edge.lines.length * 18 + 12} rx="5" />
                <text textAnchor="middle" dominantBaseline="central">
                  {edge.lines.map((line, j) => <tspan key={j} x="0" y={(j - (edge.lines.length - 1) / 2) * 18}>{line}</tspan>)}
                </text>
              </g>
            ))}
            {drawing.nodes.map(node => (
              <g key={node.id} transform={`translate(${node.x},${node.y})`} className="gc-flowchart-node">
                <rect x={-node.width / 2} y={-node.height / 2} width={node.width} height={node.height} rx="10" />
                <text textAnchor="middle" dominantBaseline="central">
                  {node.lines.map((line, i) => <tspan key={i} x="0" y={(i - (node.lines.length - 1) / 2) * 20}>{line}</tspan>)}
                </text>
              </g>
            ))}
          </svg>
        </div>
        <details className="gc-flowchart-details">
          <summary>View flowchart details</summary>
          <h4>Nodes</h4>
          <ul>{props.nodes.map(node => <li key={node.id}>{node.label}</li>)}</ul>
          <h4>Connections</h4>
          {props.edges.length === 0 ? <p>No connections.</p> : (
            <ul>{props.edges.map((edge, i) => (
              <li key={i}>{names.get(edge.source)} → {names.get(edge.target)}{edge.label ? ` (${edge.label})` : ''}</li>
            ))}</ul>
          )}
        </details>
      </figure>
    )
  },
})

export const flowchartLibrary = createLibrary({ root: 'DataFlowchart', components: [DataFlowchart] })
