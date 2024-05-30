import { BASE_URL } from "."
import { ResourceInsertBody } from "../interfaces/resource"

export default class ResourcesService {
  token: string = ""

  constructor(token: string) {
    this.token = token
  }

  async getAll() {
    const req = await fetch(`${BASE_URL}/api/v1/resource`, {
      headers: { "Authorization": this.token }
    })
    const json = req.json()

    return json
  }

  async getOne(id: number) {
    const req = await fetch(`${BASE_URL}/api/v1/resource/${id}`, {
      headers: { "Authorization": this.token }
    })
    const json = req.json()

    return json
  }

  async insertOne(insert: ResourceInsertBody) {
    const req = await fetch(`${BASE_URL}/api/v1/resource`, {
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

  async updateOne(id: number, update: ResourceInsertBody) {
    const req = await fetch(`${BASE_URL}/api/v1/resource/${id}`, {
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
    const req = await fetch(`${BASE_URL}/api/v1/resource/${id}`, {
      method: "DELETE",
      headers: { "Authorization": this.token }
    })
    const json = req.json()

    return json
  }
}
