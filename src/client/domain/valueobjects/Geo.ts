import { ValueObject } from '@domain/ValueObject';
import {
  InvalidLatitudeError,
  InvalidLongitudeError,
} from '@client/domain/errors';

export class Geo extends ValueObject<Geo.Props> {
  constructor(props: Geo.Props) {
    super(props);
    this.validate(props);
  }

  private validate(props: Geo.Props): void {
    this.latitudeValidation(props.latitude);
    this.longitudeValidation(props.longitude);
  }

  private latitudeValidation(latitude: number): void {
    if (latitude > 90 || latitude < -90) {
      throw new InvalidLatitudeError(latitude);
    }
  }

  private longitudeValidation(longitude: number): void {
    if (longitude > 180 || longitude < -180) {
      throw new InvalidLongitudeError(longitude);
    }
  }
}

export namespace Geo {
  export type Props = {
    latitude: number;
    longitude: number;
  };
}
