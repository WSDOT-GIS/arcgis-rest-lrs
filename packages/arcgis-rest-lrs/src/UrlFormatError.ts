export default class UrlFormatError extends Error {
  public url: string;
  public re: RegExp;
  constructor(url: string, re: RegExp) {
    const message = `${url} does not match ${re}.`;
    super(message);
    this.url = url;
    this.re = re;
  }
}
