import { createLibrary, defineComponent } from '@openuidev/react-lang'
import { z } from 'zod/v4'
import { statusSpecSchema } from './saved-spec'
import './status.css'

const stateLabels = {
  pending: 'Pending',
  in_progress: 'In progress',
  success: 'Success',
  warning: 'Warning',
  error: 'Error',
} as const

const stateIcons = {
  pending: '○',
  in_progress: '◐',
  success: '✓',
  warning: '!',
  error: '×',
} as const

const DataStatus = defineComponent({
  name: 'DataStatus',
  description: 'Displays a compact, saved snapshot of named statuses.',
  props: z.object({
    title: statusSpecSchema.shape.title,
    status_items: statusSpecSchema.shape.status_items,
  }),
  component: ({ props }) => (
    <section className="gc-status" aria-label={props.title}>
      <h3>{props.title}</h3>
      <ul className="gc-status-list">
        {props.status_items.map((item, index) => (
          <li key={index}>
            <div className="gc-status-main">
              <strong>{item.label}</strong>
              <span className="gc-status-badge" data-state={item.state}>
                <span aria-hidden="true">{stateIcons[item.state]}</span>
                {stateLabels[item.state]}
              </span>
            </div>
            {item.detail && <p>{item.detail}</p>}
          </li>
        ))}
      </ul>
    </section>
  ),
})

export const statusLibrary = createLibrary({ root: 'DataStatus', components: [DataStatus] })
