import axios from "axios";
import jwt from "jsonwebtoken"
import { prismaClient } from "../../clients/db";
import { generateTokenForUser } from "../../services/jwt";
import { GraphqlContext } from "../../interfaces";

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
    given_name: string;
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

        console.log(data)

        let user = await prismaClient.user.findUnique({
            where: {
                email: data.email
            }
        })

        console.log(user)

        if (!user) {
            console.error("enter")
            user = await prismaClient.user.create({
                data: {
                    email: data.email,
                    firstName: data.given_name,
                    lastName: data.family_name,
                    profileImageURL: data.picture
                }
            })

            console.log(user)
        }

        const userToken = await generateTokenForUser(user.id) as string;
        return userToken;
    },
    getCurrentUser: async (parent: any, args: any, ctx: GraphqlContext) => {
        const id = ctx.user?.id;
        if(!id) return null;
        const user = await prismaClient.user.findUnique({where: {id: id}});
        return user;
    }

}

export const resolvers = { queries }