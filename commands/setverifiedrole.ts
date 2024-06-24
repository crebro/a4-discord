import { Guild, typeConverter } from "@/fb/collectiontypes.js";
import { db } from "@/fb/firebase.js";
import { protectedCommand } from "@/utils/dfp.js";
import { options } from "@discord-fp/djs";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default protectedCommand.slash({
  description: "Set Guild Value | Admin only",
  options: {
    value: options.role({
      description: "The verified role",
      required: true,
    }),
  },
  execute: async ({ event, options }) => {
    if (!event.inGuild()) return;
    await event.reply(".. Working on it");

    // get the guild from firestore and
    const guild = await getDoc(
      doc(db, "guilds", event.guildId).withConverter(typeConverter<Guild>())
    );
    if (guild.exists()) {
      await setDoc(
        doc(db, "guilds", event.guildId).withConverter(typeConverter<Guild>()),
        {
          ...guild.data(),
          verifiedrole: options.value.id,
        }
      );
    }

    event.editReply(`verified role set to set to \`${options.value.name}\``);
  },
});
