import { verifyKey } from 'discord-interactions'
import { action } from '../_generated/server'

export default action(
  ({}, bodyText: string, signature: string, timestamp: string) => {
    return verifyKey(
      bodyText,
      signature,
      timestamp,
      (process.env as any).DISCORD_PUBLIC_KEY
    )
  }
)
