import { useEffect, useRef } from 'react'
import { createLibrary, defineComponent } from '@openuidev/react-lang'
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'
import { z } from 'zod/v4'
import { chartSpecSchema } from './saved-spec'
import './chart.css'

Chart.register(
  BarController, BarElement, CategoryScale, LinearScale,
  LineController, LineElement, PointElement, Legend, Tooltip,
)

const palette = ['#8b9dff', '#56d6ac', '#ffc66d', '#ef93d1', '#70c8f2', '#d7b0ff']

const DataChart = defineComponent({
  name: 'DataChart',
  description: 'Displays a bar or line chart with named numeric series.',
  props: z.object({
    title: chartSpecSchema.shape.title,
    chart_type: chartSpecSchema.shape.chart_type,
    labels: chartSpecSchema.shape.labels,
    series: chartSpecSchema.shape.series,
  }),
  component: function ChartView({ props }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const { title, chart_type, labels, series } = props

    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const parent = canvas.parentElement
      const foreground = parent ? getComputedStyle(parent).color : '#dedede'
      const chart = new Chart<'bar' | 'line', number[], string>(canvas, {
        type: chart_type,
        data: {
          labels: [...labels],
          datasets: series.map((item, index) => ({
            label: item.name,
            data: [...item.values],
            backgroundColor: palette[index % palette.length],
            borderColor: palette[index % palette.length],
            borderWidth: chart_type === 'bar' ? 0 : 2,
            pointRadius: labels.length > 40 ? 0 : 3,
            pointHitRadius: 8,
            tension: 0,
          })),
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
              labels: { color: foreground, usePointStyle: true, padding: 18 },
            },
            tooltip: { enabled: true },
          },
          scales: {
            x: {
              ticks: { color: foreground, autoSkip: true, maxRotation: 45 },
              grid: { display: false },
              border: { color: 'rgba(128, 128, 128, 0.4)' },
            },
            y: {
              beginAtZero: true,
              ticks: { color: foreground },
              grid: { color: 'rgba(128, 128, 128, 0.2)' },
              border: { display: false },
            },
          },
        },
      })
      return () => chart.destroy()
    }, [chart_type, labels, series])

    return (
      <figure className="gc-chart">
        <figcaption>{title}</figcaption>
        <div className="gc-chart-frame">
          <canvas ref={canvasRef} role="img" aria-label={title}>
            Chart values are available in the data table below.
          </canvas>
        </div>
        <details className="gc-chart-data">
          <summary>View chart data</summary>
          <div className="table-scroll">
            <table>
              <caption>{title} — data</caption>
              <thead>
                <tr>
                  <th scope="col">Label</th>
                  {series.map((item, index) => <th scope="col" key={index}>{item.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {labels.map((label, index) => (
                  <tr key={index}>
                    <th scope="row">{label}</th>
                    {series.map((item, seriesIndex) => <td key={seriesIndex}>{item.values[index]}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </figure>
    )
  },
})

export const chartLibrary = createLibrary({
  root: 'DataChart',
  components: [DataChart],
})
