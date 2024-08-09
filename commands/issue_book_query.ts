import { command, verifiedUserCommands } from "@/utils/dfp.js";
import { options } from "@discord-fp/djs";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/fb/firebase.js";

export default verifiedUserCommands.slash({
  options: {
    query: options.string({
      description: "Book Query",
      required: true,
    }),
  },
  description: "Issue a verification request",
  execute: async ({ event, options, ctx }) => {
    if (!event.inGuild()) {
      return;
    }

    if (ctx.message !== "success") {
      await event.reply(ctx.message);
      return;
    }
    if (!event.inGuild()) return;
    await event.reply(".. Working on it");

    await addDoc(collection(db, "bookquery"), {
      query: options.query,
    });

    await event.editReply(
      `The request for book query has successfully been made\n
     Please check back after 1 class day for the status update on your book query.
    `
    );
  },
});
