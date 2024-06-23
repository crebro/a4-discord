import { db } from "@/fb/firebase.js";
import { protectedCommand } from "@/utils/dfp.js";
import { options } from "@discord-fp/djs";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default protectedCommand.slash({
  description: "Set Guild Value | Admin only",
  options: {
    key: options.string({
      description: "Key",
    }),
    value: options.string({
      description: "Value",
    }),
  },
  execute: async ({ event, options }) => {
    if (!event.inGuild()) return;
    await event.reply(".. Working on it");

    // get the guild from firestore and
    const guild = await getDoc(doc(db, "guilds", event.guildId));
    if (guild.exists()) {
      await setDoc(doc(db, "guilds", event.guildId), {
        ...guild.data(),
        [options.key]: options.value,
      });
    }

    event.editReply(`${options.key} set to ${options.value}`);
  },
});
