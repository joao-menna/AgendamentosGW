export interface ScheduleFilters {
  userId?: number
  resourceId?: number
  classId?: number
  minDate?: string
  maxDate?: string
}

export interface ScheduleInsertBody {
  date: string
  hourId: number
  classResourceId: number
}
