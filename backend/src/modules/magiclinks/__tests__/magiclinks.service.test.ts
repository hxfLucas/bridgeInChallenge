import 'reflect-metadata'
import { randomUUID } from 'node:crypto'
import { DataSource } from 'typeorm'
import { createTestDataSource } from '../../../shared/test-helpers/createTestDataSource'
import { runWithTestAuth } from '../../../shared/test-helpers/runWithTestAuth'
import { listByCompany, createMagicLink, deleteById } from '../magiclinks.service'
import { Company } from '../../companies/companies.entity'
import { User } from '../../users/users.entity'
import { MagicLink } from '../magiclinks.entity'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

let ds: DataSource

// Seeded identifiers filled in beforeAll
let company1Id: string
let company2Id: string
let adminUser1Id: string
let managerUser1Id: string
let adminUser2Id: string

beforeAll(async () => {
  ds = await createTestDataSource()

  const companyRepo = ds.getRepository(Company)
  const userRepo = ds.getRepository(User)

  const company1 = companyRepo.create({ name: 'Company One' })
  await companyRepo.save(company1)
  company1Id = company1.id

  const company2 = companyRepo.create({name: 'Company Two' })
  await companyRepo.save(company2)
  company2Id = company2.id

  const adminUser1 = userRepo.create({
    companyId: company1Id,
    email: 'admin1@example.com',
    passwordHash: 'hash',
    role: 'admin',
  })
  await userRepo.save(adminUser1)
  adminUser1Id = adminUser1.id

  const managerUser1 = userRepo.create({
    companyId: company1Id,
    email: 'manager1@example.com',
    passwordHash: 'hash',
    role: 'manager',
  })
  await userRepo.save(managerUser1)
  managerUser1Id = managerUser1.id

  const adminUser2 = userRepo.create({
    companyId: company2Id,
    email: 'admin2@example.com',
    passwordHash: 'hash',
    role: 'admin',
  })
  await userRepo.save(adminUser2)
  adminUser2Id = adminUser2.id
})

afterAll(async () => {
  if (ds?.isInitialized) {
    await ds.destroy()
  }
})

describe('createMagicLink', () => {
  it('creates a magic link with a UUID reportingToken', async () => {
    const link = await runWithTestAuth(
      { id: adminUser1Id, role: 'admin', companyId: company1Id },
      () => createMagicLink(company1Id, null, adminUser1Id)
    )

    expect(link).toBeDefined()
    expect(link.reportingToken).toMatch(UUID_REGEX)
    expect(link.companyId).toBe(company1Id)
    expect(link.alias).toBeNull()
    expect(link.createdById).toBe(adminUser1Id)
  })

  it('creates a magic link with an alias', async () => {
    const link = await runWithTestAuth(
      { id: adminUser1Id, role: 'admin', companyId: company1Id },
      () => createMagicLink(company1Id, 'My Alias', adminUser1Id)
    )

    expect(link.alias).toBe('My Alias')
  })

  it('creates a magic link without an alias', async () => {
    const link = await runWithTestAuth(
      { id: adminUser1Id, role: 'admin', companyId: company1Id },
      () => createMagicLink(company1Id, undefined, adminUser1Id)
    )

    expect(link.alias).toBeNull()
  })
})

describe('listByCompany', () => {
  it('returns paginated result scoped to companyId', async () => {
    // Create links for both companies
    await runWithTestAuth(
      { id: adminUser1Id, role: 'admin', companyId: company1Id },
      () => createMagicLink(company1Id, 'Company1 Link', adminUser1Id)
    )
    await runWithTestAuth(
      { id: adminUser2Id, role: 'admin', companyId: company2Id },
      () => createMagicLink(company2Id, 'Company2 Link', adminUser2Id)
    )

    const result = await runWithTestAuth(
      { id: adminUser1Id, role: 'admin', companyId: company1Id },
      () => listByCompany(company1Id)
    )

    expect(result).toHaveProperty('data')
    expect(result).toHaveProperty('total')
    expect(result).toHaveProperty('hasMore')

    // All returned links belong to company1
    result.data.forEach((link: MagicLink) => {
      expect(link.companyId).toBe(company1Id)
    })
  })

  it('returns correct total and hasMore with pagination', async () => {
    // Reset by using a fresh company for isolation
    const companyRepo = ds.getRepository(Company)
    const paginationCompany = companyRepo.create({ name: 'Pagination Company' })
    await companyRepo.save(paginationCompany)
    const pagCompanyId = paginationCompany.id

    const userRepo = ds.getRepository(User)
    const pagUser = userRepo.create({
      companyId: pagCompanyId,
      email: 'paguser@example.com',
      passwordHash: 'hash',
      role: 'admin',
    })
    await userRepo.save(pagUser)

    // Create 3 links
    for (let i = 0; i < 3; i++) {
      await runWithTestAuth(
        { id: pagUser.id, role: 'admin', companyId: pagCompanyId },
        () => createMagicLink(pagCompanyId, `Link ${i}`, pagUser.id)
      )
    }

    const firstPage = await runWithTestAuth(
      { id: pagUser.id, role: 'admin', companyId: pagCompanyId },
      () => listByCompany(pagCompanyId, 0, 2)
    )

    expect(firstPage.total).toBe(3)
    expect(firstPage.data).toHaveLength(2)
    expect(firstPage.hasMore).toBe(true)

    const secondPage = await runWithTestAuth(
      { id: pagUser.id, role: 'admin', companyId: pagCompanyId },
      () => listByCompany(pagCompanyId, 2, 2)
    )

    expect(secondPage.total).toBe(3)
    expect(secondPage.data).toHaveLength(1)
    expect(secondPage.hasMore).toBe(false)
  })
})

describe('deleteById', () => {
  async function seedLink(companyId: string, createdById: string, alias?: string) {
    return runWithTestAuth(
      { id: createdById, role: 'admin', companyId },
      () => createMagicLink(companyId, alias ?? null, createdById)
    )
  }

  it('admin can delete any magic link in their company', async () => {
    const link = await seedLink(company1Id, managerUser1Id, 'Admin Delete Test')

    await expect(
      runWithTestAuth(
        { id: adminUser1Id, role: 'admin', companyId: company1Id },
        () => deleteById(link.id, company1Id, adminUser1Id, 'admin')
      )
    ).resolves.toBeUndefined()
  })

  it('manager can delete their own link', async () => {
    const link = await seedLink(company1Id, managerUser1Id, 'Manager Own Link')

    await expect(
      runWithTestAuth(
        { id: managerUser1Id, role: 'manager', companyId: company1Id },
        () => deleteById(link.id, company1Id, managerUser1Id, 'manager')
      )
    ).resolves.toBeUndefined()
  })

  it('manager cannot delete another user\'s link (403)', async () => {
    const link = await seedLink(company1Id, adminUser1Id, 'Admin Created Link')

    let thrownError: any
    try {
      await runWithTestAuth(
        { id: managerUser1Id, role: 'manager', companyId: company1Id },
        () => deleteById(link.id, company1Id, managerUser1Id, 'manager')
      )
    } catch (err) {
      thrownError = err
    }

    expect(thrownError).toBeDefined()
    expect(thrownError.status).toBe(403)
    expect(thrownError.code).toBe('FORBIDDEN')
  })

  it('throws 404 when the link does not belong to the requesting company', async () => {
    // Create a link for company2
    const link = await seedLink(company2Id, adminUser2Id, 'Company2 Link')

    let thrownError: any
    try {
      // Claim it belongs to company1 — should not be found
      await runWithTestAuth(
        { id: adminUser1Id, role: 'admin', companyId: company1Id },
        () => deleteById(link.id, company1Id, adminUser1Id, 'admin')
      )
    } catch (err) {
      thrownError = err
    }

    expect(thrownError).toBeDefined()
    expect(thrownError.status).toBe(404)
    expect(thrownError.code).toBe('NOT_FOUND')
  })
})
