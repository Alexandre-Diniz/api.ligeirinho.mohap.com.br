import deepEqual from 'deep-equal';

export abstract class ValueObject<T> {
  constructor(protected readonly props: T) {
    Object.freeze(props);
  }

  public getProps(): T {
    return this.props;
  }

  public isEqual(vo: ValueObject<T>): boolean {
    return deepEqual(this.getProps(), vo.getProps(), { strict: true });
  }
}
