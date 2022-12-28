export class InvalidLongitudeError extends Error {
  constructor(longitude: number) {
    super();
    this.message = `The longitude "${longitude} has to be lass than 180º and greater than -180º"`;
    this.name = 'InvalidClientNameError';
  }
}
