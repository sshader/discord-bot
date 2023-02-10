import { httpRouter } from 'convex/server'
import {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} from 'discord-interactions'
import { httpEndpoint } from './_generated/server'

const http = httpRouter()

http.route({
  path: '/discord',
  method: 'POST',
  handler: httpEndpoint(async ({ runQuery }, request: Request) => {
    const bodyText = await request.text()

    // Check signature -- uses discord-interactions package
    const isValidSignature = verifyKey(
      bodyText,
      request.headers.get('X-Signature-Ed25519')!,
      request.headers.get('X-Signature-Timestamp')!,
      (process.env as any).DISCORD_PUBLIC_KEY
    )
    if (!isValidSignature) {
      return new Response('Invalid signature', { status: 401 })
    }
    const body = JSON.parse(bodyText)

    // Handle ping
    if (body.type === InteractionType.PING) {
      return new Response(
        JSON.stringify({ type: InteractionResponseType.PONG }),
        { status: 200 }
      )
    }

    if (body.type === InteractionType.APPLICATION_COMMAND) {
      const data = body.data
      if (data.name === 'ask_convex') {
        const prompt = data.options[0].value
        const botResponse = await runQuery('botResponses:get', prompt)
        return new Response(
          JSON.stringify({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: botResponse },
          }),
          { headers: { 'Content-Type': 'application/json' }, status: 200 }
        )
      }
    }
    return new Response('Unknown request', { status: 500 })
  }),
})

export default http
