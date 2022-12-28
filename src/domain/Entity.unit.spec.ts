import { Entity } from '@domain/Entity';

import { validate, v4 as uuid } from 'uuid';

describe('Entity', () => {
  it('should fill id with an uuid if no one is provided', () => {
    class TargetEntity extends Entity<undefined> {
      constructor(id?: string) {
        super(undefined, id);
      }
    }
    const targetEntity = new TargetEntity();

    expect(validate(targetEntity.getId())).toBeTruthy();
  });

  it('shouldnt fill id with an uuid if one is provided', () => {
    class TargetEntity extends Entity<undefined> {
      constructor(id?: string) {
        super(undefined, id);
      }
    }
    const id = uuid();
    const targetEntity = new TargetEntity(id);

    expect(targetEntity.getId()).toBe(id);
  });

  it('should throw if an invalid id is passed', () => {
    class TargetEntity extends Entity<undefined> {
      constructor(id?: string) {
        super(undefined, id);
      }
    }
    const id = 'invalid_id';

    expect(() => new TargetEntity(id)).toThrow('Invalid ID invalid_id.');
  });

  it('should return correct props', () => {
    class TargetEntity extends Entity<{ name: string }> {
      constructor(props: { name: string }, id?: string) {
        super(props, id);
      }
    }
    const props = {
      name: 'Alexandre',
    };
    const targetEntity = new TargetEntity(props);

    expect(targetEntity.getProps()).toEqual(props);
  });

  it('should return true if the entities has the same', () => {
    class TargetEntity extends Entity<null> {
      constructor(id?: string) {
        super(null, id);
      }
    }

    const id = uuid();

    const target1Entity = new TargetEntity(id);
    const target2Entity = new TargetEntity(id);

    expect(target1Entity.isEqual(target2Entity.getId())).toBeTruthy();
  });
});
