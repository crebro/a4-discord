import prisma from "@/utils/prisma.js";
import { ChannelType, Client, MessageReaction } from "discord.js";
import verifyprocess from "./verifyprocess.js";

export default async function handleReactionAdd(reaction: MessageReaction, client: Client) {
    if (!reaction.message.guild?.id) {
        return;
    }

    const guild = await prisma.guilds.findFirst({
        where: {
            guildid: reaction.message.guild.id
        }
    });

    if (!guild) {
        return;
    }

    if (
        (reaction.message.id !== guild.messageid)
    ) {
        return;
    }
}