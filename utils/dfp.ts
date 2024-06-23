import { initDiscordFP } from "@discord-fp/djs";

export const dfp = initDiscordFP();

export const command = dfp.command;

export const protectedCommand = dfp.command.middleware(
  async ({ event, next }) => {
    if (!event.inGuild()) {
      return;
    }

    const guildmember = await event.guild?.members.fetch(event.user.id);

    if (!guildmember?.roles.cache.find((role) => role.name === "moderator")) {
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
