import axios from "axios";
import jwt from "jsonwebtoken"
import { prismaClient } from "../../clients/db";
import { generateTokenForUser } from "../../services/jwt";

interface GoogleTokenResult {
    iss?: string;
    nbf?: string;
    aud?: string;
    sub?: string;
    email: string;
    email_varified: string;
    azp?: string;
    name?: string;
    picture?: string;
    family_name: string;
    giver_name: string;
    iat?: string;
    exp?: string; 
    jit?: string; 
    alg?: string; 
    typ?: string; 
}
const queries = {
    verifyGoogleToken: async (parent: any, { token }: { token: string }) => {
        const googleToken = token;
        const googleOauthURL = new URL("https://oauth2.googleapis.com/tokeninfo");
        googleOauthURL.searchParams.set("id_token", googleToken);

        const data = jwt.decode(token) as GoogleTokenResult;

        let user = await prismaClient.user.findUnique({
            where: {
                email: data.email
            }
        })

        if (!user) {
            user = await prismaClient.user.create({
                data: {
                    email: data.email,
                    firstName: data.giver_name,
                    lastName: data.family_name,
                    profileImageURL: data.picture
                }
            })
        }

        // const userToken = await generateTokenForUser(user.id) as string;
        return "token";
    }

}

export const resolvers = { queries }