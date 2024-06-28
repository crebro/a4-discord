import { Guild, typeConverter } from "@/fb/collectiontypes.js";
import { db } from "@/fb/firebase.js";
import { protectedCommand } from "@/utils/dfp.js";
import { options } from "@discord-fp/djs";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default protectedCommand.slash({
  description: "Set Guild Value | Admin only",
  options: {
    key: options.string({
      description: "Key",
      // names: ["domain", 'mod']
      choices: {
        domain: {
          value: "domain",
          names: {
            "en-GB": "domain",
          },
        },
        mod: {
          value: "mod",
          names: {
            "en-GB": "Moderator Role | Defaults to 'mod' if not set",
          },
        },
      },
    }),
    value: options.string({
      description: "Value",
    }),
  },
  execute: async ({ event, options, ctx }) => {
    if (ctx.message === "no-perms") {
      await event.reply("You do not have permission to use this command");
      return;
    }
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
          [options.key]: options.value,
        }
      );
    }

    event.editReply(`${options.key} set to ${options.value}`);
  },
});
