import "dotenv/config";
import { dfp } from "./utils/dfp.js";
import { client } from "./utils/discord.js";
import handleDmMessage from "./handle/dmmessage.js";
import handleReactionAdd from "./handle/reactionadd.js";
import "./fb/firebase.js";
import { Events } from "discord.js";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "./fb/firebase.js";
import { Guild, typeConverter } from "./fb/collectiontypes.js";
import "./keep_alive.js";

//store your token in environment variable or put it here
const token = process.env["TOKEN"];

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);

  dfp.start({
    client,
    load: ["./commands"],
    register: {
      guilds: client.guilds.cache.map((guild) => guild.id),
    },
  });
});

client.on("messageCreate", async (message) => {
  handleDmMessage(message, client);
});

client.on("messageReactionAdd", async (reaction) => {
  handleReactionAdd(reaction, client);
});

client.on(Events.GuildCreate, (guild) => {
  console.log(`Joined guild: ${guild.name}`);
  setDoc(doc(db, "guilds", guild.id).withConverter(typeConverter<Guild>()), {
    guildid: guild.id,
    mod: "mod",
  });
});

client.on(Events.GuildDelete, (guild) => {
  console.log(`Left guild: ${guild.name}`);
  deleteDoc(doc(db, "guilds", guild.id));
});

client.login(token);
