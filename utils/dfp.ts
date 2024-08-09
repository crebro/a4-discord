import { Guild, typeConverter } from "@/fb/collectiontypes.js";
import { db } from "@/fb/firebase.js";
import { initDiscordFP } from "@discord-fp/djs";
import { PermissionsBitField } from "discord.js";
import { doc, getDoc } from "firebase/firestore";

export const dfp = initDiscordFP();

export const command = dfp.command;

export const protectedCommand = dfp.command.middleware(
  async ({ event, next }) => {
    if (!event.inGuild()) {
      return;
    }

    const guildmember = await event.guild?.members.fetch(event.user.id);

    if (
      !guildmember?.permissions.has(PermissionsBitField.Flags.ManageMessages)
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

export const verifiedUserCommands = dfp.command.middleware(
  async ({ event, next }) => {
    if (!event.inGuild()) {
      return;
    }
    const guildmember = await event.guild?.members.fetch(event.user.id);

    if (!guildmember || !guildmember.roles.cache.has("a4-verified")) {
      return next({
        ctx: {
          message: `You are not a verified user. This command is not available to you.\n
            Please use /verifyrequest to begin verification process.`,
        },
        event,
      });
    }

    return next({ ctx: { message: "success" }, event });
  }
);
