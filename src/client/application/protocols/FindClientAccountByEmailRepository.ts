import { Account } from '@client/domain/entities/Account';

export interface FindClientAccountByEmailRepository {
  findByEmail: (email: string) => Promise<Account | null> | Account | null;
}
