import { command } from "@/utils/dfp.js";
import { options } from "@discord-fp/djs";
import verifyprocess from "@/handle/verifyprocess.js";


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
            if (e.code === "P2002") {
                await event.editReply("The email you have provided is already in use. Either by you or someone else. Please contact admin.");
                return;
            }
            console.log(e);
            await event.editReply("Invalid Email");
            return;
        }

    },
});