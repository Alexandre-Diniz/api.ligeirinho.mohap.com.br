import { Entity } from '@domain/Entity';
import { InvalidLocationAddressError } from '@client/domain/errors';
import { Geo } from '@client/domain/valueobjects/Geo';

export class Address extends Entity<Address.Props> {
  constructor(props: Address.Props, id?: string) {
    super(props, id);
    this.validate(props);
  }

  private validate(props: Address.Props): void {
    this.locationValidate(props.location);
  }

  private locationValidate(location: string): void {
    if (location.length === 0) {
      throw new InvalidLocationAddressError(location);
    }
  }
}

export namespace Address {
  export type Props = {
    location: string;
    geo: Geo;
  };
}
