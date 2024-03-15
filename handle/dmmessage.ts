import prisma from "@/utils/prisma.js";
import { ChannelType, Client, Message } from "discord.js";
import { z } from "zod";

const codeschema = z.coerce.number().int().min(1000).max(9999);

export default async function handleDmMessage(message: Message, client: Client ) {
    if (message.channel.type !== ChannelType.DM || message.author.id === client.user?.id) {
        return
    }

    if (message.author.bot) {
        return;
    }

    try {
        const code = codeschema.parse(message.content);

        const useremail = await prisma.useremails.update({
            where: {
                verification_code_userid: {
                    verification_code: code,
                    userid: message.author.id
                }
            },
            data: {
                is_verified: true,
            },
        });

        const guild = await prisma.guilds.findFirst({
            where: {
                guildid: useremail.guildid
            }
        });

        if (!guild) {
            throw new Error("Guild not found");
        }

        // adds the verified role to the user
        (await client.guilds.fetch(useremail.guildid)).members.fetch(message.author.id).then((member) => {
            member.roles.add(guild.verifiedrole);
        });

        message.reply("Verification Successful, You have been given the verified role.");

        console.log(`code is ${code}`);
    } catch (e) {
        message.reply("Verification Failed, Please contact admin.")
    }




    


    console.log(`recieved a message! ${message.content} from  ${message.author.id} `);
}