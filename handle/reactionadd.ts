import {
  ChannelType,
  Client,
  MessageReaction,
  PartialMessageReaction,
} from "discord.js";
import verifyprocess from "./verifyprocess.js";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/fb/firebase.js";
import { Guild, typeConverter } from "@/fb/collectiontypes.js";

export default async function handleReactionAdd(
  reaction: MessageReaction | PartialMessageReaction,
  client: Client
) {
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

  // query guilds using firebase to get the guild details
  const q = await query(
    collection(db, "guilds").withConverter(typeConverter<Guild>()),
    where("guildid", "==", reaction.message.guild.id)
  );
  const ssDocs = (await getDocs(q)).docs;
  if (ssDocs.length === 0) {
    return;
  }

  const guild = ssDocs[0].data();

  if (
    !guild ||
    reaction.message.id !== guild.messageid ||
    !reaction.client.user
  ) {
    return;
  }

  // send a direct message to the author with details on how to verify
  (await client.guilds.fetch(guild.guildid)).members
    .fetch(reaction.client.user.id)
    .then((member) => {
      member.createDM();
      member.send(
        "You have reacted to the verification message. Please check your direct messages for further instructions."
      );
    });
  // reaction.client.user.createDM();
  // reaction.client.user.send("You have reacted to the verification message. Please check your direct messages for further instructions.");
}
