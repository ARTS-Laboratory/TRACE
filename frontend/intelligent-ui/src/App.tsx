import { useState } from 'react'
import { Renderer } from '@openuidev/react-lang'
import { library, example, checklistLibrary, checklistExample } from './visual-library'
import './App.css'

export default function App() {
  const [checklistState, setChecklistState] = useState<
    Record<string, unknown>
  >({})

  return (
    <main className="visual-demo">
      <h1>Intelligent UI proof of concept</h1>

      <Renderer
        library={library}
        response={example}
        isStreaming={false}
        onError={(errors) => {
          if (errors.length > 0) {
            console.error('Table errors:', errors)
          }
        }}
      />

      <Renderer
        library={checklistLibrary}
        response={checklistExample}
        isStreaming={false}
        onStateUpdate={setChecklistState}
        onError={(errors) => {
          if (errors.length > 0) {
            console.error('Checklist errors:', errors)
          }
        }}
      />

      <h2>Current checklist state</h2>
      <pre className="state-preview">
        {JSON.stringify(checklistState, null, 2)}
      </pre>
    </main>
  )
}