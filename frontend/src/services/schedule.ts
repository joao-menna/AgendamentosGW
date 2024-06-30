import { ScheduleFilters, ScheduleInsertBody } from "../interfaces/schedule"
import { BASE_URL } from "."

export default class ScheduleService {
  token: string = ""

  constructor(token: string) {
    this.token = token
  }

  async getAllFiltered(filters: ScheduleFilters) {
    const query = []

    if (filters.userId !== undefined) query.push(`userId=${filters.userId}`)
    if (filters.resourceId !== undefined)
      query.push(`resourceId=${filters.resourceId}`)
    if (filters.classId !== undefined) query.push(`classId=${filters.classId}`)
    if (filters.minDate !== undefined) query.push(`minDate=${filters.minDate}`)
    if (filters.maxDate !== undefined) query.push(`maxDate=${filters.maxDate}`)

    const req = await fetch(`${BASE_URL}/api/v1/schedule?${query.join("&")}`, {
      headers: { Authorization: this.token }
    })

    const json = await req.json()

    return json
  }

  async insertOne(schedule: ScheduleInsertBody) {
    const req = await fetch(`${BASE_URL}/api/v1/schedule`, {
      method: "POST",
      headers: {
        Authorization: this.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(schedule)
    })

    if (req.status === 400) {
      throw new Error()
    }

    const json = await req.json()

    return json
  }

  async deleteOne(id: number) {
    const req = await fetch(`${BASE_URL}/api/v1/schedule/${id}`, {
      method: "DELETE",
      headers: { Authorization: this.token },
    })

    const json = await req.json()

    return json
  }
}
