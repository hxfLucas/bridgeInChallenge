import { randomUUID } from 'crypto'
import { MagicLink } from './magiclinks.entity'

export async function generateMagicLinkData(): Promise<{ reportingToken: string }> {
  const uuid = randomUUID()
  return { reportingToken: uuid }
}

// Serialize a MagicLink entity for API responses, preserving nested createdBy.email
export function serializeMagicLink(m: MagicLink) {
  return {
    id: m.id,
    reportingToken: m.reportingToken,
    companyId: m.companyId,
    alias: m.alias,
    createdById: m.createdById,
    createdBy: m.createdBy
      ? {
          id: (m.createdBy as any).id,
          email: (m.createdBy as any).email,
        }
      : null,
    createdAt: m.createdAt,
  }
}