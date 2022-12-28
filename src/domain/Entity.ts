import { v4 as uuid, validate } from 'uuid';

export abstract class Entity<T> {
  private readonly id: string;

  constructor(protected readonly props: T, id?: string) {
    if (id && !validate(id)) {
      throw new Error(`Invalid ID ${id}.`);
    }
    this.id = id ?? uuid();
  }

  public getId(): string {
    return this.id;
  }

  public getProps(): T {
    return this.props;
  }

  public isEqual(id: string): boolean {
    return this.id === id;
  }
}
