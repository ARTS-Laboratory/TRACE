import {
  createLibrary,
  defineComponent,
  reactive,
  useStateField,
} from '@openuidev/react-lang'
import { z } from 'zod/v4'
import './visuals.css'

const DataTable = defineComponent({
  name: 'DataTable',
  description: 'Displays a titled table with text columns and rows.',
  props: z.object({
    title: z.string(),
    columns: z.array(z.string()),
    rows: z.array(z.array(z.string())),
  }),
  component: ({ props }) => (
    <div className="table-scroll">
      <table>
        <caption>{props.title}</caption>
        <thead>
          <tr>
            {props.columns.map((column, index) => (
              <th key={index} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
})

export const library = createLibrary({
  root: 'DataTable',
  components: [DataTable],
})

export const example = `
root = DataTable(
  "GlorpCat renderer test",
  ["Component", "Purpose"],
  [
    ["FastAPI", "Backend"],
    ["Vanilla JavaScript", "Conversation interface"],
    ["React + OpenUI", "Visual rendering"]
  ]
)
`

const ChecklistItem = defineComponent({
  name: 'ChecklistItem',
  description: 'A checkbox with a stable name and visible label.',
  props: z.object({
    name: z.string(),
    label: z.string(),
    value: reactive(z.boolean()),
  }),
  component: function ChecklistItemView({ props }) {
    const { value, setValue } = useStateField(
      props.name,
      props.value,
    )

    return (
      <label className="checklist-item">
        <input
          type="checkbox"
          checked={value === true}
          onChange={(event) => setValue(event.currentTarget.checked)}
        />
        <span>{props.label}</span>
      </label>
    )
  },
})

const Checklist = defineComponent({
  name: 'Checklist',
  description: 'A titled group of checklist items.',
  props: z.object({
    title: z.string(),
    items: z.array(ChecklistItem.ref),
  }),
  component: ({ props, renderNode }) => (
    <fieldset className="checklist">
      <legend>{props.title}</legend>
      {renderNode(props.items)}
    </fieldset>
  ),
})

export const checklistLibrary = createLibrary({
  root: 'Checklist',
  components: [Checklist, ChecklistItem],
})

export const checklistExample = `
root = Checklist("Renderer checks", [tableCheck, interactionCheck, stateCheck])
$table = false
$interaction = false
$state = false
tableCheck = ChecklistItem("table", "Table renders correctly", $table)
interactionCheck = ChecklistItem("interaction", "Checkboxes respond to clicks", $interaction)
stateCheck = ChecklistItem("state", "State output changes below", $state)
`

