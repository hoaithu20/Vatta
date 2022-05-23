export class PaginateResult<T> {
  constructor(readonly items: T[], readonly count: number) {}

  static init(items, count) {
    return new PaginateResult(items, count);
  }
}
