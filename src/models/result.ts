declare const SECRET_SYMBOL: unique symbol;

export class Result {
   // @ts-ignore
   private readonly [SECRET_SYMBOL]: unknown;

   constructor(url: URL) {
      // @ts-ignore
      return Buffer.from(JSON.stringify({ link: url.toString() }));
   }
}