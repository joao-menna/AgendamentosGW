import { BASE_URL } from "."
import { SystemFirstTime } from "../interfaces/system"

export default class SystemService {
  async isFirstTime() {
    const req = await fetch(`${BASE_URL}/api/v1/system/first-time`)
    const json = await req.json()

    return json
  }

  async systemFirstTime(info: SystemFirstTime) {
    const req = await fetch(`${BASE_URL}/api/v1/system/first-time`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(info)
    })
    const json = await req.json()

    return json
  }
}
