import jwt from "jsonwebtoken";
import { JWTUser } from "../interfaces";

export function generateTokenForUser(userId: string){
    const payload: JWTUser = {
        id: userId
    }
    const token = jwt.sign(payload, "secret");
    return token;
}

export function decodeTokenForUser(token: string){
    try{
        const decodedToken = token.split(" ")[1];
        return jwt.verify(decodedToken, "secret") as JWTUser;
    }catch(err){
        return null;
    }

}