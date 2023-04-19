import { Id } from './_generated/dataModel'
import { mutation, query } from './_generated/server'
export const get = query(async ({ db }, { prompt }: { prompt: string}) => {
  const responseOrNull = await db
    .query('bot_responses')
    .filter((q) => q.eq(q.field('prompt'), prompt))
    .unique()
  return (
    responseOrNull?.response ?? "There's no stored response for that prompt!"
  )
})

export const list = query(async ({ db }) => {
  return db.query('bot_responses').collect()
})

export const add = mutation(async ({ db }, { prompt, response}: {prompt: string, response: string }) => {
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

export const remove = mutation(async ({ db }, { id }: { id: Id<any> }) => {
  await db.delete(id)
})
