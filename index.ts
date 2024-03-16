import "dotenv/config";
import { dfp } from "./utils/dfp.js";
import { client } from "./utils/discord.js";
import handleDmMessage from "./handle/dmmessage.js";
import prisma from "./utils/prisma.js";
import handleReactionAdd from "./handle/reactionadd.js";

//store your token in environment variable or put it here
const token = process.env["TOKEN"];

client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}!`);

    dfp.start({
        client,
        load: ["./commands"],
        register: {
            guilds: client.guilds.cache.map((guild) =>guild.id
            ),
        },
    });
});

client.on("messageCreate", async (message) => {
    handleDmMessage(message, client);
})

client.on("messageReactionAdd", async (reaction) => {
    handleReactionAdd(reaction, client);
});

client.login(token);
