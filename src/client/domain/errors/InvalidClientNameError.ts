export class InvalidClientNameError extends Error {
  constructor(name: string) {
    super();
    this.message = `The name "${name} have two be at least two words"`;
    this.name = 'InvalidClientNameError';
  }
}
