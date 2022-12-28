import { Geo } from './Geo';
import {
  InvalidLatitudeError,
  InvalidLongitudeError,
} from '@client/domain/errors';

import { faker } from '@faker-js/faker';

const makeGeoProps = (): Geo.Props => ({
  latitude: parseFloat(faker.address.latitude()),
  longitude: parseFloat(faker.address.longitude()),
});

describe('Geo Value Object', () => {
  it('should throw if a latitude greater than 90 is passed', () => {
    const props = makeGeoProps();
    props.latitude = 90.1;
    expect(() => new Geo(props)).toThrow(
      new InvalidLatitudeError(props.latitude),
    );
  });

  it('should throw if a latitude less than -90 is passed', () => {
    const props = makeGeoProps();
    props.latitude = -90.1;
    expect(() => new Geo(props)).toThrow(
      new InvalidLatitudeError(props.latitude),
    );
  });

  it('should throw if a longitude greater than 180 is passed', () => {
    const props = makeGeoProps();
    props.longitude = 180.1;
    expect(() => new Geo(props)).toThrow(
      new InvalidLongitudeError(props.longitude),
    );
  });

  it('should throw if a longitude less than -180 is passed', () => {
    const props = makeGeoProps();
    props.longitude = -180.1;
    expect(() => new Geo(props)).toThrow(
      new InvalidLongitudeError(props.longitude),
    );
  });
});
