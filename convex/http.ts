import { httpRouter } from 'convex/server'
import { InteractionResponseType, InteractionType } from 'discord-interactions'
import { httpEndpoint } from './_generated/server'
const http = httpRouter()

http.route({
  path: '/discord',
  method: 'POST',
  handler: httpEndpoint(async ({ runAction, runQuery }, request: Request) => {
    const bodyText = await request.text()
    const isValidSignature = await runAction(
      'actions/verifyDiscordKey',
      bodyText,
      request.headers.get('X-Signature-Ed25519')!,
      request.headers.get('X-Signature-Timestamp')!
    )
    if (!isValidSignature) {
      return new Response('Invalid signature', { status: 401 })
    }
    const body = JSON.parse(bodyText)
    if (body.type === InteractionType.PING) {
      return new Response(
        JSON.stringify({ type: InteractionResponseType.PONG }),
        { status: 200 }
      )
    }

    if (body.type === InteractionType.APPLICATION_COMMAND) {
      const data = body.data
      if (data.name === 'ask_convex') {
        const botResponse = await runQuery(
          'botResponses:getBotResponse',
          data.options[0].value
        )
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
