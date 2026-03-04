import { randomUUID } from 'crypto'

export async function generateMagicLinkData(): Promise<{ reportingToken: string }> {
  const uuid = randomUUID()
  return { reportingToken: uuid }
}