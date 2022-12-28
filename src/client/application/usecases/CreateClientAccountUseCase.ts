import { Account } from '@client/domain/entities/Account';
import { CreateClientAccount } from '@client/domain/usecases/CreateClientAccount';
import { Validation } from '@client/application/protocols/Validation';
import { Hasher } from '@client/application/protocols/Hasher';
import { Client } from '@client/domain/entities/Client';
import { FindClientAccountByEmailRepository } from '@client/application/protocols/FindClientAccountByEmailRepository';
import { FindClientAccountByUsernameRepository } from '@client/application/protocols/FindClientAccountByUsernameRepository';
import { ClientAccountEmailExistsError } from '@client/application/errors/ClientAccountEmailExistsError';
import { SaveClientAccountRepository } from '@client/application/protocols/SaveClientAccountRepository';

import { Inject } from '@nestjs/common';
import { Address } from '@client/domain/entities/Address';
import { Geo } from '@client/domain/valueobjects/Geo';

export class CreateClientAccountUseCase implements CreateClientAccount {
  constructor(
    @Inject('VALIDATION')
    private readonly validation: Validation<CreateClientAccount.RequestDTO>,
    @Inject('HASHER')
    private readonly hasher: Hasher,
    @Inject('CLIENT_ACCOUNT_REPOSITORY')
    private readonly clientAccountRepository: FindClientAccountByEmailRepository &
      FindClientAccountByUsernameRepository &
      SaveClientAccountRepository,
  ) {}

  create = async (
    request: CreateClientAccount.RequestDTO,
  ): Promise<Account> => {
    await this.validation.validate(request);
    const passwordHashed = await this.hasher.hash(request.password);
    const clientAccountEmailExists =
      await this.clientAccountRepository.findByEmail(request.email);
    if (clientAccountEmailExists) {
      throw new ClientAccountEmailExistsError(request.email);
    }
    await this.clientAccountRepository.findByUsername(request.username);
    const addresses = request.client.addresses.map(
      (address) =>
        new Address({
          location: address.location,
          geo: new Geo({
            latitude: address.geo.latitude,
            longitude: address.geo.longitude,
          }),
        }),
    );
    const client = new Client({
      addresses,
      birthdate: request.client.birthdate,
      contact: request.client.contact,
      cpf: request.client.cpf,
      name: request.client.name,
    });
    const account = new Account({
      client,
      email: request.email,
      password: passwordHashed,
      username: request.username,
    });
    await this.clientAccountRepository.save(account);
    return account;
  };
}
