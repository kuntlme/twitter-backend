import jwt from "jsonwebtoken";
import { prismaClient } from "../clients/db";

export async function generateTokenForUser(userId: string){
    const user = await prismaClient.user.findUnique({ where: { id: userId}});
    const payload = {
        id: user?.id
    }
    const token = jwt.sign(payload, "secret");
    return token;
}