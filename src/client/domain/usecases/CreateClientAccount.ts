import { UseCase } from '@domain/UseCase';
import { Account } from '@client/domain/entities/Account';

export interface CreateClientAccount
  extends UseCase<
    CreateClientAccount.RequestDTO,
    CreateClientAccount.Response
  > {
  create: (
    request: CreateClientAccount.RequestDTO,
  ) => CreateClientAccount.Response;
}

export namespace CreateClientAccount {
  export type RequestDTO = {
    username: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    client: Client;
  };
  type Client = {
    name: string;
    birthdate: Date;
    contact: string;
    cpf: string;
    addresses: Array<Address>;
  };
  type Address = {
    location: string;
    geo: Geo;
  };
  type Geo = {
    latitude: number;
    longitude: number;
  };

  export type Response = Account | Promise<Account>;
}
