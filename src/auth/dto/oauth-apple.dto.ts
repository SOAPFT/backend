export class JwtPayload {
  iss: string;
  sub: string;
  aud: string;
  iat: number;
  exp: number;
  email: string;
  email_verified: boolean;
  is_private_email: boolean;
  nonce_supported: boolean;
}
