import { Client, GatewayIntentBits, Partials } from "discord.js";

export const client = new Client({ intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
] , partials: [Partials.Channel, Partials.Message, Partials.Reaction]});
