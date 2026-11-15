import { createLibrary, defineComponent } from '@openuidev/react-lang'
import { z } from 'zod/v4'
import { comparisonSpecSchema } from './saved-spec'
import './comparison.css'

const DataComparison = defineComponent({
  name: 'DataComparison',
  description: 'Compares named options against shared criteria.',
  props: z.object({
    title: comparisonSpecSchema.shape.title,
    criteria: comparisonSpecSchema.shape.criteria,
    options: comparisonSpecSchema.shape.options,
  }),
  component: ({ props }) => (
    <section className="gc-comparison" aria-label={props.title}>
      <h3>{props.title}</h3>
      <div className="gc-comparison-scroll" role="region" aria-label={`${props.title} comparison`} tabIndex={0}>
        <table>
          <caption className="gc-comparison-caption">{props.title}</caption>
          <thead>
            <tr>
              <th scope="col">Criterion</th>
              {props.options.map((option, index) => (
                <th scope="col" key={index}>{option.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {props.criteria.map((criterion, index) => (
              <tr key={index}>
                <th scope="row">{criterion}</th>
                {props.options.map((option, optionIndex) => (
                  <td key={optionIndex}>
                    {option.values[index] || <span className="gc-comparison-empty" aria-label="Unspecified">—</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  ),
})

export const comparisonLibrary = createLibrary({
  root: 'DataComparison',
  components: [DataComparison],
})
