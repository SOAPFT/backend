export interface JwtPayload {
  iss: string; // https://appleid.apple.com
  aud: string; // Your app's bundle ID
  exp: number; // Expiration time
  iat: number; // Issued at time
  sub: string; // User's unique Apple ID
  at_hash?: string;
  email?: string; // User's email (if available)
  email_verified?: boolean | string;
  is_private_email?: boolean | string;
  auth_time?: number;
  nonce_supported?: boolean;
  real_user_status?: number; // 0: 의심스러운 사용자, 1: 일반 사용자, 2: 높은 신뢰도 사용자
}
