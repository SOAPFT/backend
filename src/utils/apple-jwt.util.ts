import * as jwt from 'jsonwebtoken';

/**
 * JWT 토큰의 헤더를 디코딩하여 반환
 * @param token JWT 토큰
 * @returns 디코딩된 헤더 객체
 */
export function decodeTokenHeader(token: string): any {
  try {
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded || typeof decoded === 'string') {
      throw new Error('Invalid token format');
    }
    return decoded.header;
  } catch (error) {
    throw new Error(`Failed to decode token header: ${error.message}`);
  }
}
