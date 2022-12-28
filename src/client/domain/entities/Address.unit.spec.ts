import { Address } from '@client/domain/entities/Address';
import { InvalidLocationAddressError } from '@client/domain/errors/InvalidLocationAddressError';
import { Geo } from '@client/domain/valueobjects/Geo';

import { faker } from '@faker-js/faker';

const makeGeo = (): Geo => {
  return new Geo({
    latitude: parseFloat(faker.address.latitude()),
    longitude: parseFloat(faker.address.longitude()),
  });
};

const makeAddressProps = (): Address.Props => ({
  location: faker.address.streetAddress(),
  geo: makeGeo(),
});

describe('Address Entity', () => {
  it('should throw if no locaiton is passed', () => {
    const props = makeAddressProps();
    props.location = '';
    expect(() => new Address(props)).toThrow(
      new InvalidLocationAddressError(props.location),
    );
  });
});
