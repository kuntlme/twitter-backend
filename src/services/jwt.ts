import jwt from "jsonwebtoken";
import { prismaClient } from "../clients/db";

export async function generateTokenForUser(userId: string){
    const payload = {
        id: userId
    }
    const token = jwt.sign(payload, "secret");
    return token;
}