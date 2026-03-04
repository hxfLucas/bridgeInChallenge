import {User} from '../users/users.entity';
import { getAppDataSource } from '../../shared/database/data-source';

type AdminUser = { id: any; companyId: any; role?: string };

export async function createUserForCompany(adminUser: AdminUser, { email, name }: { email: string; name: string }){
  if (!email || !name) throw new Error('Invalid input');
  const repo = getAppDataSource().getRepository(User);
  const existing = await repo.findOneBy({ email });
  if (existing) throw { code: 'DUPLICATE_EMAIL' };

  const user = repo.create({
    email,
    name,
    role: 'manager', // force manager role for company-created users
    companyId: adminUser.companyId,
  } as Partial<User>);

  return repo.save(user);
}

export async function deleteUserFromCompany(adminUser: AdminUser, targetUserId: any){
  const repo = getAppDataSource().getRepository(User);
  const target = await repo.findOneBy({ id: targetUserId });
  if (!target) throw { code: 'NOT_FOUND' };
  if (target.companyId !== adminUser.companyId) throw { code: 'FORBIDDEN' };
  if (target.role === 'admin') throw { code: 'CANNOT_DELETE_ADMIN' };

  await repo.remove(target);
  return;
}

export default {
  createUserForCompany,
  deleteUserFromCompany,
};
