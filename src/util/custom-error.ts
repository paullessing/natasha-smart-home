export class CustomError {
  constructor(public message: string) {}
  public toString(): string {
    return this.message;
  }
}
