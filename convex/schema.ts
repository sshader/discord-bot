import { defineSchema, defineTable } from 'convex/schema'
import { v } from "convex/values"

export default defineSchema({
  bot_responses: defineTable({
    prompt: v.string(),
    response: v.string(),
  }),
})
