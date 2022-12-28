export class InvalidLatitudeError extends Error {
  constructor(latitude: number) {
    super();
    this.message = `The latitude "${latitude} has to be lass than 90º and greater than -90°"`;
    this.name = 'InvalidClientNameError';
  }
}
