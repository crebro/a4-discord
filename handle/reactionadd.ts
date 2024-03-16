import prisma from "@/utils/prisma.js";
import { ChannelType, Client, MessageReaction, PartialMessageReaction } from "discord.js";
import verifyprocess from "./verifyprocess.js";

export default async function handleReactionAdd(reaction: MessageReaction | PartialMessageReaction, client: Client) {
    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            console.error("Something went wrong when fetching the message: ", error);
            return;
        }
    }

    if (!reaction.message.guild?.id) {
        return;
    }

    const guild = await prisma.guilds.findFirst({
        where: {
            guildid: reaction.message.guild.id
        }
    });

    if (!guild || reaction.message.id !== guild.messageid || !reaction.client.user) {
        return;
    }

    // send a direct message to the author with details on how to verify
    (await client.guilds.fetch(guild.guildid)).members.fetch(reaction.client.user.id).then((member) => {
        member.createDM();
        member.send("You have reacted to the verification message. Please check your direct messages for further instructions.");
    })
    // reaction.client.user.createDM();
    // reaction.client.user.send("You have reacted to the verification message. Please check your direct messages for further instructions.");

}