export class InvalidClientContactError extends Error {
  constructor(contact: string) {
    super();
    this.message = `The contact "${contact} must be provided"`;
    this.name = 'InvalidClientContactError';
  }
}
