export interface BlockInsertBody {
  hourId: number
  date: string
  period: 'matutine' | 'vespertine'
}