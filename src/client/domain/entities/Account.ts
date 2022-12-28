import { Entity } from '@domain/Entity';
import { Client } from '@client/domain/entities/Client';

export class Account extends Entity<Account.Props> {
  constructor(props: Account.Props, id?: string) {
    super(props, id);
  }
}

export namespace Account {
  export type Props = {
    username: string;
    email: string;
    password: string;
    client: Client;
  };
}
