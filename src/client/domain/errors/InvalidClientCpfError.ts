export class InvalidClientCpfError extends Error {
  constructor(cpf: string) {
    super();
    this.message = `The contact "${cpf} must be valid"`;
    this.name = 'InvalidClientCpfError';
  }
}
