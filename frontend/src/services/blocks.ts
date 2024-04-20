import { BASE_URL } from "."
import { BlockInsertBody } from "../interfaces/block"

export default class BlockService {
  token: string = ""

  constructor(token: string) {
    this.token = token
  }

  async getAll() {
    const req = await fetch(`${BASE_URL}/api/v1/block`, {
      headers: { "Authorization": this.token }
    })
    const json = await req.json()

    return json
  }

  async insertOne(block: BlockInsertBody) {
    const req = await fetch(`${BASE_URL}/api/v1/block`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": this.token
      },
      body: JSON.stringify(block)
    })
    const json = await req.json()

    return json
  }

  async deleteOne(id: number) {
    const req = await fetch(`${BASE_URL}/api/v1/block/${id}`, {
      method: "DELETE",
      headers: { "Authorization": this.token }
    })
    const json = await req.json()

    return json
  }
}
