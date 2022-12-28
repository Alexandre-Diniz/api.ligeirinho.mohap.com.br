import { Account } from '@client/domain/entities/Account';

export interface FindClientAccountByUsernameRepository {
  findByUsername: (
    username: string,
  ) => Promise<Account | null> | Account | null;
}
