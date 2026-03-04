import crypto from 'crypto'
import { getAppDataSource } from '../../shared/database/data-source'
import { MagicLink } from './magiclinks.entity'
import { Company } from '../companies/companies.entity'

export class MagicLinksService {
  private get repo() { return getAppDataSource().getRepository(MagicLink) }

  async list(companyId: string): Promise<MagicLink[]> {
    return await this.repo.find({ where: { company: { id: companyId } } })
  }

  async create(companyId: string): Promise<MagicLink> {
    const reportingToken = crypto.randomBytes(24).toString('hex')
    const link = this.repo.create({
      reportingToken,
      company: ({ id: companyId } as unknown) as Company,
    })
    return await this.repo.save(link)
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id)
  }
}
