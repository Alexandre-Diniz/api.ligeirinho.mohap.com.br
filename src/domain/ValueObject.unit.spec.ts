import { ValueObject } from '@domain/ValueObject';

type Props = {
  key: string;
};

class ValueObjectTarget extends ValueObject<Props> {
  public modifyProps() {
    this.props.key = 'new_value';
  }
}

describe('Value Object', () => {
  it('should throw if someone tries to modify props', () => {
    const target = new ValueObjectTarget({ key: 'old_value' });
    expect(() => target.modifyProps()).toThrow();
  });

  it('should return true if the same props are compared', () => {
    const target = new ValueObjectTarget({ key: 'any_value' });
    const newTarget = new ValueObjectTarget({ key: 'any_value' });
    expect(target.isEqual(newTarget)).toBeTruthy();
  });
});
