export interface SessionData {
  userId: string
  name: string
  email: string
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  }
  return bytes
}

function base64urlEncode(buf: ArrayBuffer): string {
  return Buffer.from(buf).toString('base64url')
}

function base64urlDecode(str: string): Uint8Array {
  return new Uint8Array(Buffer.from(str, 'base64url'))
}

async function getKey(): Promise<CryptoKey> {
  const secret = process.env.SESSION_SECRET
  if (!secret) throw new Error('SESSION_SECRET is not set')
  const raw = hexToBytes(secret).slice(0, 32)
  return crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, false, [
    'encrypt',
    'decrypt',
  ])
}

export async function encryptSession(payload: SessionData): Promise<string> {
  const key = await getKey()
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encoded = new TextEncoder().encode(JSON.stringify(payload))
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded)
  return `${base64urlEncode(iv.buffer)}.${base64urlEncode(ciphertext)}`
}

export async function decryptSession(cookie: string): Promise<SessionData | null> {
  try {
    const [ivPart, ciphertextPart] = cookie.split('.')
    if (!ivPart || !ciphertextPart) return null
    const key = await getKey()
    const iv = base64urlDecode(ivPart)
    const ciphertext = base64urlDecode(ciphertextPart)
    const plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv.buffer as ArrayBuffer },
      key,
      ciphertext.buffer as ArrayBuffer
    )
    return JSON.parse(new TextDecoder().decode(plaintext)) as SessionData
  } catch {
    return null
  }
}
