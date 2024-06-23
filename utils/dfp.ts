import { Guild, typeConverter } from "@/fb/collectiontypes.js";
import { db } from "@/fb/firebase.js";
import { initDiscordFP } from "@discord-fp/djs";
import { doc, getDoc } from "firebase/firestore";

export const dfp = initDiscordFP();

export const command = dfp.command;

export const protectedCommand = dfp.command.middleware(
  async ({ event, next }) => {
    if (!event.inGuild()) {
      return;
    }

    const guildmember = await event.guild?.members.fetch(event.user.id);
    const guild = await getDoc(
      doc(db, "guilds", event.guildId).withConverter(typeConverter<Guild>())
    );
    if (!guild.exists()) {
      return;
    }
    const guilddata = guild.data();

    if (
      !guildmember?.roles.cache.find(
        (role) => role.name === (guilddata.mod ?? "moderator")
      )
    ) {
      return next({
        ctx: {
          message: "no-perms",
        },
        event,
      });
    }

    return next({
      ctx: {
        message: "success",
      },
      event,
    });
  }
);
