import { BASE_URL } from "."
import { ClassInsertBody, ClassResourceInsertBody, ClassUpdateBody } from "../interfaces/class"

export default class ClassService {
  token: string = ""

  constructor(token: string) {
    this.token = token
  }

  async getAll() {
    const req = await fetch(`${BASE_URL}/api/v1/class`, {
      headers: { "Authorization": this.token }
    })
    const json = req.json()

    return json
  }

  async getOne(id: number) {
    const req = await fetch(`${BASE_URL}/api/v1/class/${id}`, {
      headers: { "Authorization": this.token }
    })
    const json = req.json()

    return json
  }

  async insertOne(insert: ClassInsertBody) {
    const req = await fetch(`${BASE_URL}/api/v1/class`, {
      method: "POST",
      headers: {
        "Authorization": this.token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(insert)
    })
    const json = req.json()

    return json
  }

  async updateOne(id: number, update: ClassUpdateBody) {
    const req = await fetch(`${BASE_URL}/api/v1/class/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": this.token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(update)
    })
    const json = req.json()

    return json
  }

  async deleteOne(id: number) {
    const req = await fetch(`${BASE_URL}/api/v1/class/${id}`, {
      method: "DELETE",
      headers: { "Authorization": this.token }
    })
    const json = req.json()

    return json
  }

  async getAllResource(classId: number) {
    const req = await fetch(`${BASE_URL}/api/v1/class/${classId}/resource`, {
      headers: { "Authorization": this.token }
    })
    const json = req.json()

    return json
  }

  async insertOneResource(classId: number, insert: ClassResourceInsertBody) {
    const req = await fetch(`${BASE_URL}/api/v1/class/${classId}/resource`, {
      method: "POST",
      headers: {
        "Authorization": this.token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(insert)
    })
    const json = req.json()

    return json
  }

  async deleteOneResource(classId: number, resourceId: number) {
    const req = await fetch(`${BASE_URL}/api/v1/class/${classId}/resource/${resourceId}`, {
      method: "DELETE",
      headers: { "Authorization": this.token }
    })
    const json = req.json()

    return json
  }
}
