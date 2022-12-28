import { Account } from '@client/domain/entities/Account';

export interface SaveClientAccountRepository {
  save: (account: Account) => Promise<void> | void;
}
