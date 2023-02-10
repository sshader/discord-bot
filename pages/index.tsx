import { useState } from 'react'
import { useMutation, useQuery } from '../convex/_generated/react'

export default function App() {
  const botResponses = useQuery('botResponses:list') || []

  const [newPromptText, setNewPromptText] = useState('')
  const [newResponseText, setNewResponseText] = useState('')
  const addBotResponse = useMutation('botResponses:add')
  const deleteBotResponse = useMutation('botResponses:remove')

  async function handleAddPrompt(event: any) {
    event.preventDefault()
    setNewPromptText('')
    setNewResponseText('')
    await addBotResponse(newPromptText, newResponseText)
  }
  return (
    <main>
      <table style={{ width: 600, textAlign: 'left' }}>
        <thead>
          <tr>
            <th>When someone says...</th>
            <th>Discord bot responds with...</th>
          </tr>
        </thead>
        <tbody>
          {botResponses.map((botResponse) => (
            <tr key={botResponse._id.toString()}>
              <td>{botResponse.prompt}</td>
              <td>{botResponse.response}</td>
              <td onClick={() => deleteBotResponse(botResponse._id)}>X</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>
              <input
                value={newPromptText}
                onChange={(event) => setNewPromptText(event.target.value)}
                placeholder="New prompt…"
              />
            </td>
            <td>
              <input
                value={newResponseText}
                onChange={(event) => setNewResponseText(event.target.value)}
                placeholder="New response…"
              />
            </td>
            <td>
              <button
                disabled={!newPromptText || !newResponseText}
                onClick={handleAddPrompt}
              >
                Add prompt
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
    </main>
  )
}
