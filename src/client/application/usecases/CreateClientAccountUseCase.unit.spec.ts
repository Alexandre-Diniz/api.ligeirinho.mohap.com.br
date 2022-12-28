import { CreateClientAccount } from '@client/domain/usecases/CreateClientAccount';
import { Validation } from '@client/application/protocols/Validation';
import { Hasher } from '@client/application/protocols/Hasher';
import { CreateClientAccountUseCase } from '@client/application/usecases/CreateClientAccountUseCase';
import { Account } from '@client/domain/entities/Account';
import { FindClientAccountByEmailRepository } from '@client/application/protocols/FindClientAccountByEmailRepository';
import { ClientAccountEmailExistsError } from '@client/application/errors/ClientAccountEmailExistsError';
import { FindClientAccountByUsernameRepository } from '@client/application/protocols/FindClientAccountByUsernameRepository';
import { SaveClientAccountRepository } from '@client/application/protocols/SaveClientAccountRepository';
import { Client } from '@client/domain/entities/Client';
import { makeClientProps } from '@client/domain/entities/Client.unit.spec';
import { Geo } from '@client/domain/valueobjects/Geo';
import { Address } from '@client/domain/entities/Address';

import * as uuid from 'uuid';
import { faker } from '@faker-js/faker';
import { cpf as cpfGenarator } from 'cpf-cnpj-validator';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { Injectable } from '@nestjs/common';

jest.mock('uuid');

type GeoDto = {
  latitude: number;
  longitude: number;
};
type AddressDto = {
  location: string;
  geo: GeoDto;
  id?: string;
};
type ClintDto = {
  addresses: Array<AddressDto>;
  birthdate: Date;
  contact: string;
  cpf: string;
  name: string;
  id?: string;
};
type AccountDto = {
  client: ClintDto;
  email: string;
  password: string;
  username: string;
  id?: string;
};

class AccountFactory {
  public static make(accountDto: AccountDto): Account {
    const addresses = accountDto.client.addresses.map(
      (address) =>
        new Address(
          {
            location: address.location,
            geo: new Geo({
              latitude: address.geo.latitude,
              longitude: address.geo.longitude,
            }),
          },
          address.id,
        ),
    );
    const client = new Client(
      {
        addresses,
        birthdate: accountDto.client.birthdate,
        contact: accountDto.client.contact,
        cpf: accountDto.client.cpf,
        name: accountDto.client.name,
      },
      accountDto.client.id,
    );
    const account = new Account(
      {
        client,
        email: accountDto.email,
        password: accountDto.password,
        username: accountDto.username,
      },
      accountDto.id,
    );
    return account;
  }
}

export class CreateClientAccountPropsFactory {
  public static make = (): CreateClientAccount.RequestDTO => {
    const password: string = faker.internet.password(20);
    return {
      email: faker.internet.email(),
      password,
      passwordConfirmation: password,
      username: faker.internet.userName(),
      client: {
        birthdate: faker.date.birthdate(),
        contact: faker.phone.number('###########'),
        cpf: cpfGenarator.generate(false),
        name: faker.name.fullName(),
        addresses: [],
      },
    };
  };
}

@Injectable()
class ManagerAccountRepositoryStub
  implements
    FindClientAccountByEmailRepository,
    FindClientAccountByUsernameRepository,
    SaveClientAccountRepository
{
  async findByEmail(email: string): Promise<Account | null> {
    return null;
  }

  async findByUsername(username: string): Promise<Account | null> {
    return null;
  }

  async save(account: Account): Promise<void> {}
}

@Injectable()
class ValidationStub implements Validation<CreateClientAccount.RequestDTO> {
  async validate(params: CreateClientAccount.RequestDTO): Promise<void> {}
}

@Injectable()
class HasherStub implements Hasher {
  hash(value: string): string {
    return 'hashed_value';
  }
}

type SutReturnType = {
  clientAccountRepository: FindClientAccountByEmailRepository &
    FindClientAccountByUsernameRepository &
    SaveClientAccountRepository;
  hasher: Hasher;
  validation: Validation<CreateClientAccount.RequestDTO>;
  sut: CreateClientAccount;
};

class CreateClientAccountModuleFactory {
  public static make(): TestingModuleBuilder {
    return Test.createTestingModule({
      controllers: [CreateClientAccountUseCase],
      providers: [
        {
          provide: 'VALIDATION',
          useClass: ValidationStub,
        },
        {
          provide: 'HASHER',
          useClass: HasherStub,
        },
        {
          provide: 'CLIENT_ACCOUNT_REPOSITORY',
          useClass: ManagerAccountRepositoryStub,
        },
      ],
    });
  }
}

class SutFactory {
  public static async make(): Promise<SutReturnType> {
    const moduleRef = await CreateClientAccountModuleFactory.make().compile();
    const clientAccountRepository = moduleRef.get<
      FindClientAccountByEmailRepository &
        FindClientAccountByUsernameRepository &
        SaveClientAccountRepository
    >('CLIENT_ACCOUNT_REPOSITORY');
    const validation =
      moduleRef.get<Validation<CreateClientAccount.RequestDTO>>('VALIDATION');
    const hasher = moduleRef.get<Hasher>('HASHER');
    const sut = moduleRef.get<CreateClientAccount>(CreateClientAccountUseCase);
    return { sut, validation, hasher, clientAccountRepository };
  }
}

describe('CreateClientAccountUseCase', () => {
  beforeEach(async () => {
    await CreateClientAccountModuleFactory.make().compile();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
  it('should call validation with correct params', async () => {
    const { sut, validation } = await SutFactory.make();
    const request = CreateClientAccountPropsFactory.make();
    const validateSpy = jest.spyOn(validation, 'validate');

    await sut.create(request);

    expect(validateSpy).toHaveBeenCalledTimes(1);
    expect(validateSpy).toHaveBeenCalledWith(request);
  });

  it('should throw if validation throws', async () => {
    const { sut, validation } = await SutFactory.make();
    const request = CreateClientAccountPropsFactory.make();
    const validateSpy = jest.spyOn(validation, 'validate');

    validateSpy.mockRejectedValueOnce(new Error('Any Custom Error'));

    const response = sut.create(request);

    await expect(response).rejects.toThrow(new Error('Any Custom Error'));
  });

  it('should call Hasher with correct params', async () => {
    const { sut, hasher } = await SutFactory.make();
    const request = CreateClientAccountPropsFactory.make();
    const hasherSpy = jest.spyOn(hasher, 'hash');

    await sut.create(request);

    expect(hasherSpy).toHaveBeenCalledTimes(1);
    expect(hasherSpy).toHaveBeenCalledWith(request.password);
  });

  it('should throw if Hahser throws', async () => {
    const { sut, hasher } = await SutFactory.make();
    const request = CreateClientAccountPropsFactory.make();
    jest
      .spyOn(hasher, 'hash')
      .mockRejectedValueOnce(new Error('Any Custom Error'));

    const response = sut.create(request);

    await expect(response).rejects.toThrow(new Error('Any Custom Error'));
  });

  it('should call FindManagerAccountByEmailRepository with correct email', async () => {
    const { sut, clientAccountRepository } = await SutFactory.make();
    const request = CreateClientAccountPropsFactory.make();
    const clientAccountSpy = jest.spyOn(clientAccountRepository, 'findByEmail');

    await sut.create(request);

    expect(clientAccountSpy).toHaveBeenCalledTimes(1);
    expect(clientAccountSpy).toHaveBeenCalledWith(request.email);
  });

  it('should throw if FindManagerAccountByEmailRepository throws', async () => {
    const { sut, clientAccountRepository } = await SutFactory.make();
    const request = CreateClientAccountPropsFactory.make();
    jest
      .spyOn(clientAccountRepository, 'findByEmail')
      .mockRejectedValueOnce(new Error('Any Custom Error'));

    const response = sut.create(request);

    await expect(response).rejects.toThrow(new Error('Any Custom Error'));
  });

  it('should throw if FindClientAccountByEmailRepository finds Accout', async () => {
    const { sut, clientAccountRepository } = await SutFactory.make();
    const request = CreateClientAccountPropsFactory.make();
    jest.spyOn(clientAccountRepository, 'findByEmail').mockResolvedValueOnce(
      new Account({
        client: new Client(makeClientProps()),
        email: faker.internet.email(),
        password: faker.internet.password(),
        username: faker.internet.userName(),
      }),
    );

    const response = sut.create(request);

    await expect(response).rejects.toThrow(
      new ClientAccountEmailExistsError(request.email),
    );
  });

  it('should call FindManagerAccountByUsernameRepository with correct username', async () => {
    const { sut, clientAccountRepository } = await SutFactory.make();
    const request = CreateClientAccountPropsFactory.make();
    const clientAccountSpy = jest.spyOn(
      clientAccountRepository,
      'findByUsername',
    );

    await sut.create(request);

    expect(clientAccountSpy).toHaveBeenCalledTimes(1);
    expect(clientAccountSpy).toHaveBeenCalledWith(request.username);
  });

  it('should throw if FindManagerAccountByUsernameRepository throws', async () => {
    const { sut, clientAccountRepository } = await SutFactory.make();
    const request = CreateClientAccountPropsFactory.make();
    jest
      .spyOn(clientAccountRepository, 'findByUsername')
      .mockRejectedValueOnce(new Error('Any Custom Error'));

    const response = sut.create(request);

    await expect(response).rejects.toThrow(new Error('Any Custom Error'));
  });

  it('should call SaveManagerAccountRepository with correct Account', async () => {
    const { sut, clientAccountRepository, hasher } = await SutFactory.make();
    const request = CreateClientAccountPropsFactory.make();
    const saveSpy = jest.spyOn(clientAccountRepository, 'save');
    jest.spyOn(hasher, 'hash').mockResolvedValue('password_hashed');
    const id = 'fddb5116-a571-44c1-9fce-b25b87b94e4b';
    jest.spyOn(uuid, 'v4').mockImplementation(() => id);
    jest.spyOn(uuid, 'validate').mockImplementation((id: string) => true);

    const account = AccountFactory.make({
      ...request,
      password: 'password_hashed',
    });

    await sut.create(request);

    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(account);
  });

  it('should throws if SaveManagerAccountRepository throws', async () => {
    const { sut, clientAccountRepository, hasher } = await SutFactory.make();
    const request = CreateClientAccountPropsFactory.make();
    const saveSpy = jest.spyOn(clientAccountRepository, 'save');
    jest.spyOn(hasher, 'hash').mockResolvedValue('password_hashed');
    const id = 'fddb5116-a571-44c1-9fce-b25b87b94e4b';
    jest.spyOn(uuid, 'v4').mockImplementation(() => id);
    jest.spyOn(uuid, 'validate').mockImplementation((id: string) => true);
    jest
      .spyOn(clientAccountRepository, 'save')
      .mockRejectedValueOnce(new Error('Any Custom Error'));

    const account = AccountFactory.make({
      ...request,
      password: 'password_hashed',
    });

    const response = sut.create(request);

    await expect(response).rejects.toThrow(new Error('Any Custom Error'));
  });

  it('should return correct Account', async () => {
    const { sut, hasher } = await SutFactory.make();
    const request = CreateClientAccountPropsFactory.make();
    jest.spyOn(hasher, 'hash').mockResolvedValue('password_hashed');
    const id = 'fddb5116-a571-44c1-9fce-b25b87b94e4b';
    jest.spyOn(uuid, 'v4').mockImplementation(() => id);
    jest.spyOn(uuid, 'validate').mockImplementation((id: string) => true);

    const account = AccountFactory.make({
      ...request,
      password: 'password_hashed',
    });

    const accountCreated = await sut.create(request);

    expect(accountCreated).toEqual(account);
  });
});
