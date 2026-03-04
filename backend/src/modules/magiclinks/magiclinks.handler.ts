import { Request, Response } from 'express'
import { getAuthenticatedUserData } from '../../shared/auth/authContext'
import { listByCompany, createMagicLink, deleteById } from './magiclinks.service'


export async function listMagicLinks(req: Request, res: Response): Promise<void> {
  const companyId = getAuthenticatedUserData().companyId;
  if (!companyId) {
    res.status(400).json({ error: 'companyId is required' })
    return
  }
  const items = await listByCompany(companyId)
  res.status(200).json(items)
}

export async function createNewMagicLink(req: Request, res: Response): Promise<void> {
  const companyId = getAuthenticatedUserData().companyId;
  if (!companyId) {
    res.status(400).json({ error: 'companyId is required' })
    return
  }
  const created = await createMagicLink(companyId)
  res.status(201).json({ id: created.id, reportingToken: created.reportingToken, createdAt: created.createdAt })
}

export async function deleteMagicLink(req: Request, res: Response): Promise<void> {
  const { id } = req.params as { id?: string }
  if (!id) {
    res.status(400).json({ error: 'id is required' })
    return
  }
  const companyId = getAuthenticatedUserData().companyId
  if (!companyId) {
    res.status(400).json({ error: 'companyId is required' })
    return
  }

  await deleteById(id, companyId)
  res.status(204).send()
}
