export default class ExpressionError extends Error {
  constructor(message: string) {
      super(message);
  }
}