import { JwtPayload, verify } from 'jsonwebtoken'

export default async function verifyJWT (token: string): Promise<JwtPayload | undefined> {
  const payload = verify(token, process.env.JWT_PRIVATE_KEY ?? 'fixed key', {})

  if (typeof payload === 'string') {
    return undefined
  }

  return payload
}
