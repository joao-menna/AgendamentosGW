export interface ClassInsertBody {
  name: string
  period: "matutine" | "vespertine"
  teacherId: number
}

export interface ClassUpdateBody {
  name?: string
  period?: "matutine" | "vespertine"
  teacherId?: number
}

export interface ClassResourceInsertBody {
  classId: number
  resourceId: number
}
