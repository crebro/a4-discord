import { command, protectedCommand } from "@/utils/dfp.js";
import { options } from "@discord-fp/djs";
import verifyprocess from "@/handle/verifyprocess.js";
import prisma from "@/utils/prisma.js";


export default protectedCommand.slash({
    description: "View verified emails on a member",
    options: {
        member: options.user({description: "The member to view"})
    },
    execute: async ({ event, options }) => {
        if (!event.inGuild()) return;
        await event.reply(".. Working on it");

        const useremails = await prisma.useremails.findMany({
            where: {
                userid: options.member.value.id,
                guildid: event.guildId,
            }
        });

        await event.editReply("This user has the following emails verified: \n" + useremails.map((email) => email.email).join("\n") || "No emails found");
    },
});