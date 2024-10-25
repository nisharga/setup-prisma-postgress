import prisma from "../../../prisma-client/prisma"

class Service {
  async AddUser(payload: any) { 
    const result = await prisma.user.create({
      data: payload,
    })
    return result
  } 
}
export const AuthService = new Service()
