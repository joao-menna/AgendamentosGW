import { BASE_URL } from "."
import { UserInsertBody, UserLoginBody, UserUpdateBody } from "../interfaces/user"

export default class UserService {
  token: string = ""

  constructor(token?: string) {
    if (token) {
      this.token = token
    }
  }

  async getAll() {
    const req = await fetch(`${BASE_URL}/api/v1/user`, {
      headers: { "Authorization": this.token }
    })
    const json = await req.json()

    return json
  }

  async getOne(id: number) {
    const req = await fetch(`${BASE_URL}/api/v1/user/${id}`, {
      headers: { "Authorization": this.token }
    })
    const json = await req.json()

    return json
  }

  async insertOne(user: UserInsertBody) {
    const req = await fetch(`${BASE_URL}/api/v1/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": this.token
      },
      body: JSON.stringify(user)
    })
    const json = await req.json()

    return json
  }

  async updateOne(id: number, user: UserUpdateBody) {
    const req = await fetch(`${BASE_URL}/api/v1/user/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": this.token
      },
      body: JSON.stringify(user)
    })
    const json = await req.json()

    return json
  }

  async deleteOne(id: number) {
    const req = await fetch(`${BASE_URL}/api/v1/user/${id}`, {
      method: "DELETE",
      headers: { "Authorization": this.token }
    })
    const json = await req.json()

    return json
  }

  async login(user: UserLoginBody) {
    const req = await fetch(`${BASE_URL}/api/v1/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    })
    const json = await req.json()

    return json
  }
}
