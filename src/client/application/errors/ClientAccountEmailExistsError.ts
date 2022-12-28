export class ClientAccountEmailExistsError extends Error {
  constructor(email: string) {
    super();
    this.name = 'ClientAccountEmailExistsError';
    this.message = `Client Account with email ${email} already exists.`;
  }
}
