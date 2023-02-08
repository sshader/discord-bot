import { defineSchema, defineTable, s } from 'convex/schema'

export default defineSchema({
  bot_responses: defineTable({
    prompt: s.string(),
    response: s.string(),
  }),
})
