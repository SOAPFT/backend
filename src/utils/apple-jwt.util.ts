// JWT header 디코딩
export function decodeTokenHeader(token: string): { [key: string]: string } {
  const header = token.split('.')[0];
  return JSON.parse(Buffer.from(header, 'base64').toString('utf8'));
}
