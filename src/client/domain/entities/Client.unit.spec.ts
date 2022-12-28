import {
  InvalidClientContactError,
  InvalidClientCpfError,
  InvalidClientNameError,
} from '@client/domain/errors';
import { Client } from '@client/domain/entities/Client';

import { faker } from '@faker-js/faker';
import { cpf as cpfGenarator } from 'cpf-cnpj-validator';

export const makeClientProps = (): Client.Props => ({
  name: faker.name.fullName(),
  contact: faker.phone.number('###########'),
  birthdate: faker.date.birthdate(),
  cpf: cpfGenarator.generate(false),
  addresses: [],
});

describe('Client Enity', () => {
  it('should throw if the name has less than two words', () => {
    const props = makeClientProps();
    props.name = 'invalid_name';
    expect(() => new Client(props)).toThrow(
      new InvalidClientNameError(props.name),
    );
  });

  it('should throw if no contact is passed', () => {
    const props = makeClientProps();
    props.contact = '';
    expect(() => new Client(props)).toThrow(
      new InvalidClientContactError(props.contact),
    );
  });

  it('should throw if an invalid cpf if provided', () => {
    const props = makeClientProps();
    props.cpf = 'invalid_cpf';
    expect(() => new Client(props)).toThrow(
      new InvalidClientCpfError(props.cpf),
    );
  });
});
