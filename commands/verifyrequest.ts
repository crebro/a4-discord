import { command } from "@/utils/dfp.js";
import { options } from "@discord-fp/djs";

import mailsender from "@/utils/emailsender.js";
import prisma from "@/utils/prisma.js";
import { z } from "zod";
import verifyprocess from "@/handle/verifyprocess.js";

const emailschema = z.string().email();


export default command.slash({
    description: "Issue a verification request",
    options: {
        email: options
            .string({
                description: "Your Email",
            })
    },
    execute: async ({ event, options }) => {
        if (!event.inGuild()) return;
        await event.reply(".. Working on it");
        
        // check if email is valid
        try {
            await verifyprocess({
                email: options.email,
                guildid: event.guildId,
                userid: event.user.id
            });
            await event.editReply(`Hello! ${options.email}. Please check your email inbox`);
            await event.user.createDM();
            await event.user.send(`Please check your email \`${options.email}\`. and send the code you recieved. `)

        } catch (e) {
            await event.reply("Invalid Email");
            return;
        }

    },
});