export type WaitlistRole = 'tenant' | 'landlord'

export interface WaitlistEntry {
  id: string
  email: string
  full_name: string | null
  role: WaitlistRole
  created_at: string
}

export interface JoinWaitlistInput {
  email: string
  full_name?: string
  role: WaitlistRole
}
