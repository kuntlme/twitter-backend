import { Tweet } from "@prisma/client";
import { prismaClient } from "../../clients/db";
import { GraphqlContext } from "../../interfaces";

interface createTweetPayload {
    content: string
    imageURL?: string
}

const queries = {
    getAllTweets: () => prismaClient.tweet.findMany({orderBy: { createdAt: "desc"}}),
}

const mutations = {
    createTweet: async (parent: any, 
        { payload }: { payload: createTweetPayload }, 
        ctx: GraphqlContext) => {
        if (!ctx.user) throw Error("you are not authenticated");
        const tweet = await prismaClient.tweet.create({
            data: {
                content: payload.content,
                imageURL: payload.imageURL,
                author: {connect: { id: ctx.user.id }}
            }
        })

        if(!tweet) throw Error("tweet not created");
        return tweet;
    }
}

const extraResolvers = {
    Tweet: {
        author: (parent: Tweet) => prismaClient.user.findUnique({ where: { id: parent.authorId }})
    }
}

export const resolvers = {
    mutations,
    extraResolvers,
    queries
}