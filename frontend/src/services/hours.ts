import { BASE_URL } from "."

export default class HourService {
  token: string = ""

  constructor(token: string) {
    this.token = token
  }

  async getAll() {
    const req = await fetch(`${BASE_URL}/api/v1/hour`, {
      headers: { "Authorization": this.token }
    })
    const json = await req.json()

    return json
  }

  async insertAll() {
    const req = await fetch(`${BASE_URL}/api/v1/hour`, {
      method: "POST",
      headers: { "Authorization": this.token }
    })
    const json = await req.json()

    return json
  }

  async deleteAll() {
    const req = await fetch(`${BASE_URL}/api/v1/hour`, {
      method: "DELETE",
      headers: { "Authorization": this.token }
    })
    const json = await req.json()

    return json
  }
}
