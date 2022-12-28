import { Entity } from '@domain/Entity';
import {
  InvalidClientContactError,
  InvalidClientCpfError,
  InvalidClientNameError,
} from '@client/domain/errors';
import { Address } from '@client/domain/entities/Address';

import { cpf as cpfValidator } from 'cpf-cnpj-validator';

export class Client extends Entity<Client.Props> {
  constructor(props: Client.Props, id?: string) {
    super(props, id);
    this.validate(props);
  }

  private validate(props: Client.Props): void {
    this.nameValidation(props.name);
    this.contactValidation(props.contact);
    this.cpfValidation(props.cpf);
  }

  private nameValidation(name: string): void {
    if (name.split(' ').length < 2) {
      throw new InvalidClientNameError(name);
    }
  }

  private contactValidation(contact: string): void {
    if (contact.length < 9) {
      throw new InvalidClientContactError(contact);
    }
  }

  private cpfValidation(cpf: string): void {
    if (!cpfValidator.isValid(cpf)) {
      throw new InvalidClientCpfError(cpf);
    }
  }
}

export namespace Client {
  export type Props = {
    name: string;
    contact: string;
    birthdate: Date;
    cpf: string;
    addresses: Array<Address>;
  };
}
