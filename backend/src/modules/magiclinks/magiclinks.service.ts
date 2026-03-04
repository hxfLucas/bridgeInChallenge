import { getAppDataSource } from '../../shared/database/data-source'
import { MagicLink } from './magiclinks.entity'
import { generateMagicLinkData } from './magiclinks.utils'

export async function listByCompany(companyId: string): Promise<MagicLink[]> {
  const repo = getAppDataSource().getRepository(MagicLink)
  const items = await repo.find({
    where: { company: { id: companyId } as any },
    order: { createdAt: 'DESC' },
  })
  return items
}

export async function createMagicLink(companyId: string): Promise<MagicLink> {
  const repo = getAppDataSource().getRepository(MagicLink)
  const magicLinkData = await generateMagicLinkData()

  const entity = repo.create({
    reportingToken: magicLinkData.reportingToken,
    company: { id: companyId } as any,
  } as Partial<MagicLink>)

  const saved = await repo.save(entity)
  return saved
}

export async function deleteById(id: string, companyId?: string): Promise<void> {
  const repo = getAppDataSource().getRepository(MagicLink)

  let link: MagicLink | null = null
  if (companyId) {
    link = await repo.findOne({ where: { id, company: { id: companyId } as any } })
  } else {
    link = await repo.findOneBy({ id } as any)
  }

  if (!link) {
    const err: any = new Error('Magic link not found')
    err.code = 'NOT_FOUND'
    err.status = 404
    throw err
  }

  await repo.remove(link)
}

export default { listByCompany, createMagicLink, deleteById }
