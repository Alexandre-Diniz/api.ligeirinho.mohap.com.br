export interface Validation<T> {
  validate: (params: T) => void | Promise<void>;
}
