import { mutation, query } from './_generated/server'
export const getBotResponse = query(async ({ db }, prompt) => {
  const responseOrNull = await db
    .query('bot_responses')
    .filter((q) => q.eq(q.field('prompt'), prompt))
    .unique()
  return (
    responseOrNull?.response ?? "There's no stored response for that prompt!"
  )
})

export const listBotResponses = query(async ({ db }) => {
  return db.query('bot_responses').collect()
})

export const addBotResponse = mutation(async ({ db }, prompt, response) => {
  const responseOrNull = await db
    .query('bot_responses')
    .filter((q) => q.eq(q.field('prompt'), prompt))
    .unique()
  if (responseOrNull === null) {
    await db.insert('bot_responses', { prompt, response })
  } else {
    await db.patch(responseOrNull._id, { response })
  }
  return null
})

export const deleteBotResponse = mutation(async ({ db }, id) => {
  await db.delete(id)
})
