export class InvalidLocationAddressError extends Error {
  constructor(location: string) {
    super();
    this.message = `The contact "${location} must be provided"`;
    this.name = 'InvalidLocationAddressError';
  }
}
