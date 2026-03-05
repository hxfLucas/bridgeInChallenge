import 'reflect-metadata';
import crypto from 'crypto';
import { DataSource } from 'typeorm';
import { createTestDataSource } from '../../../shared/test-helpers/createTestDataSource';
import { runWithTestAuth } from '../../../shared/test-helpers/runWithTestAuth';
import { Company } from '../../companies/companies.entity';
import { User } from '../users.entity';
import {
  createUserForCompany,
  deleteUserFromCompany,
  updateUserPassword,
  listUsers,
} from '../users.service';

// ─── Shared state ────────────────────────────────────────────────────────────

let ds: DataSource;
let companyId: string;
let adminUserId: string;
let managerUserId: string;

const adminAuth = () => ({ id: adminUserId, role: 'admin', companyId });
const managerAuth = () => ({ id: managerUserId, role: 'manager', companyId });

// ─── Setup / teardown ────────────────────────────────────────────────────────

beforeAll(async () => {
  ds = await createTestDataSource();

  companyId = crypto.randomUUID();
  adminUserId = crypto.randomUUID();
  managerUserId = crypto.randomUUID();

  const companyRepo = ds.getRepository(Company);
  await companyRepo.save(
    companyRepo.create({ id: companyId, name: 'Test Corp' } as Partial<Company>),
  );

  const userRepo = ds.getRepository(User);
  await userRepo.save(
    userRepo.create({
      id: adminUserId,
      companyId,
      email: 'admin@test.com',
      passwordHash: 'salthex:keyhex',
      role: 'admin',
    } as Partial<User>),
  );
  await userRepo.save(
    userRepo.create({
      id: managerUserId,
      companyId,
      email: 'manager@test.com',
      passwordHash: 'salthex:keyhex',
      role: 'manager',
    } as Partial<User>),
  );
});

afterAll(async () => {
  await ds.destroy();
});

// ─── createUserForCompany ────────────────────────────────────────────────────

describe('createUserForCompany', () => {
  it('admin role → creates user; passwordHash is in salt:hex format and role is manager', async () => {
    const created = await runWithTestAuth(adminAuth(), () =>
      createUserForCompany({ email: 'new-user@test.com', password: 'Secret123!' }),
    );

    expect(created.id).toBeDefined();
    expect(created.email).toBe('new-user@test.com');
    expect(created.role).toBe('manager');
    expect(created.passwordHash).toMatch(/^[a-f0-9]+:[a-f0-9]+$/);

    // Verify row is actually persisted
    const row = await ds.getRepository(User).findOneBy({ id: created.id });
    expect(row).not.toBeNull();
  });

  it('manager role → throws FORBIDDEN (403)', async () => {
    const err: any = await runWithTestAuth(managerAuth(), () =>
      createUserForCompany({ email: 'should-not-exist@test.com', password: 'pw' }),
    ).catch((e) => e);

    expect(err.status).toBe(403);
    expect(err.code).toBe('FORBIDDEN');
  });

  it('duplicate email within same company → throws DUPLICATE_EMAIL (409)', async () => {
    // Seed the existing user directly so the service only calls createUserForCompany once
    const userRepo = ds.getRepository(User);
    await userRepo.save(
      userRepo.create({
        id: crypto.randomUUID(),
        companyId,
        email: 'duplicate@test.com',
        passwordHash: 'salthex:keyhex',
        role: 'manager',
      } as Partial<User>),
    );

    const err: any = await runWithTestAuth(adminAuth(), () =>
      createUserForCompany({ email: 'duplicate@test.com', password: 'pw2' }),
    ).catch((e) => e);

    expect(err.status).toBe(409);
    expect(err.code).toBe('DUPLICATE_EMAIL');
  });
});

// ─── deleteUserFromCompany ───────────────────────────────────────────────────

describe('deleteUserFromCompany', () => {
  let targetManagerId: string;

  beforeEach(async () => {
    // Seed a fresh manager to delete in each test that needs one
    const userRepo = ds.getRepository(User);
    const freshId = crypto.randomUUID();
    await userRepo.save(
      userRepo.create({
        id: freshId,
        companyId,
        email: `to-delete-${Date.now()}@test.com`,
        passwordHash: 'salthex:keyhex',
        role: 'manager',
      } as Partial<User>),
    );
    targetManagerId = freshId;
  });

  it('admin deletes manager → user is removed from DB', async () => {
    await runWithTestAuth(adminAuth(), () =>
      deleteUserFromCompany(targetManagerId, companyId),
    );

    const row = await ds.getRepository(User).findOneBy({ id: targetManagerId });
    expect(row).toBeNull();
  });

  it('manager role → throws FORBIDDEN (403)', async () => {
    const err: any = await runWithTestAuth(managerAuth(), () =>
      deleteUserFromCompany(targetManagerId, companyId),
    ).catch((e) => e);

    expect(err.status).toBe(403);
    expect(err.code).toBe('FORBIDDEN');
  });

  it('unknown user id → throws NOT_FOUND (404)', async () => {
    const err: any = await runWithTestAuth(adminAuth(), () =>
      deleteUserFromCompany('00000000-0000-0000-0000-000000000000', companyId),
    ).catch((e) => e);

    expect(err.status).toBe(404);
    expect(err.code).toBe('NOT_FOUND');
  });

  it('target user is admin → throws CANNOT_DELETE_ADMIN (403)', async () => {
    const err: any = await runWithTestAuth(adminAuth(), () =>
      deleteUserFromCompany(adminUserId, companyId),
    ).catch((e) => e);

    expect(err.status).toBe(403);
    expect(err.code).toBe('CANNOT_DELETE_ADMIN');
  });
});

// ─── updateUserPassword ──────────────────────────────────────────────────────

describe('updateUserPassword', () => {
  let targetUserId: string;

  beforeEach(async () => {
    const userRepo = ds.getRepository(User);
    const freshId = crypto.randomUUID();
    await userRepo.save(
      userRepo.create({
        id: freshId,
        companyId,
        email: `pw-target-${Date.now()}@test.com`,
        passwordHash: 'oldsalt:oldhex',
        role: 'manager',
      } as Partial<User>),
    );
    targetUserId = freshId;
  });

  it('admin updates password → new passwordHash is saved in salt:hex format', async () => {
    await runWithTestAuth(adminAuth(), () =>
      updateUserPassword({ id: targetUserId, password: 'NewPass456!' }),
    );

    const row = await ds.getRepository(User).findOneBy({ id: targetUserId });
    expect(row).not.toBeNull();
    expect(row!.passwordHash).toMatch(/^[a-f0-9]+:[a-f0-9]+$/);
    expect(row!.passwordHash).not.toBe('oldsalt:oldhex');
  });

  it('non-admin role → throws FORBIDDEN (403)', async () => {
    const err: any = await runWithTestAuth(managerAuth(), () =>
      updateUserPassword({ id: targetUserId, password: 'irrelevant' }),
    ).catch((e) => e);

    expect(err.status).toBe(403);
    expect(err.code).toBe('FORBIDDEN');
  });

  it('unknown user id → throws NOT_FOUND (404)', async () => {
    const err: any = await runWithTestAuth(adminAuth(), () =>
      updateUserPassword({ id: '00000000-0000-0000-0000-000000000000', password: 'pw' }),
    ).catch((e) => e);

    expect(err.status).toBe(404);
    expect(err.code).toBe('NOT_FOUND');
  });
});

// ─── listUsers ───────────────────────────────────────────────────────────────

describe('listUsers', () => {
  let listCompanyId: string;

  beforeAll(async () => {
    // Use a dedicated company so row counts are predictable
    listCompanyId = crypto.randomUUID();
    const companyRepo = ds.getRepository(Company);
    await companyRepo.save(
      companyRepo.create({ id: listCompanyId, name: 'List Corp' } as Partial<Company>),
    );

    const userRepo = ds.getRepository(User);
    // Seed 3 users with explicit IDs
    for (let i = 1; i <= 3; i++) {
      await userRepo.save(
        userRepo.create({
          id: crypto.randomUUID(),
          companyId: listCompanyId,
          email: `list-user-${i}@test.com`,
          passwordHash: 'salthex:keyhex',
          role: 'manager',
        } as Partial<User>),
      );
    }
  });

  it('returns correct { data, total, hasMore: false } when all results fit', async () => {
    const result = await listUsers({ companyId: listCompanyId, offset: 0, limit: 10 });

    expect(result.total).toBe(3);
    expect(result.data).toHaveLength(3);
    expect(result.hasMore).toBe(false);
    expect(result.data[0]).toMatchObject({
      email: expect.any(String),
      role: expect.any(String),
      companyId: listCompanyId,
      id: expect.any(String),
      createdAt: expect.any(Date),
    });
  });

  it('hasMore: true when there are more results than the limit', async () => {
    const result = await listUsers({ companyId: listCompanyId, offset: 0, limit: 2 });

    expect(result.total).toBe(3);
    expect(result.data).toHaveLength(2);
    expect(result.hasMore).toBe(true);
  });

  it('returns empty data for a company with no users', async () => {
    const companyRepo = ds.getRepository(Company);
    const emptyCompanyId = crypto.randomUUID();
    const emptyCompany = await companyRepo.save(
      companyRepo.create({ id: emptyCompanyId, name: 'Empty Corp' } as Partial<Company>),
    );

    const result = await listUsers({ companyId: emptyCompany.id, offset: 0, limit: 10 });

    expect(result.total).toBe(0);
    expect(result.data).toHaveLength(0);
    expect(result.hasMore).toBe(false);
  });

  it('offset pagination works — second page returns remaining items', async () => {
    const page1 = await listUsers({ companyId: listCompanyId, offset: 0, limit: 2 });
    const page2 = await listUsers({ companyId: listCompanyId, offset: 2, limit: 2 });

    expect(page1.data).toHaveLength(2);
    expect(page2.data).toHaveLength(1);
    expect(page2.hasMore).toBe(false);

    // No overlapping ids
    const ids1 = page1.data.map((u) => u.id);
    const ids2 = page2.data.map((u) => u.id);
    expect(ids1.some((id) => ids2.includes(id))).toBe(false);
  });
});
