import { BASE_URL } from "."

export default class PingService {
  async index() {
    const req = await fetch(`${BASE_URL}`)
    const json = await req.json()

    return json
  }

  async api() {
    const req = await fetch(`${BASE_URL}/api`)
    const json = await req.json()

    return json
  }

  async v1() {
    const req = await fetch(`${BASE_URL}/api/v1`)
    const json = await req.json()

    return json
  }
}