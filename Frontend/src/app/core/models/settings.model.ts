export interface UpdateFeesRequest {
  standartFees: DefaultFee[]
}

export interface DefaultFee {
  id?: number,
  value: number | null,
  description: string
}
