import { protectedCommand } from "@/utils/dfp.js";
import { options } from "@discord-fp/djs";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/fb/firebase.js";
import {
  UserEmail,
  VerifiedInfo,
  typeConverter,
} from "@/fb/collectiontypes.js";

export default protectedCommand.slash({
  description: "View verified emails on a member | Admin Only",
  options: {
    email: options.string({ description: "The email to identify" }),
  },
  execute: async ({ event, options, ctx }) => {
    if (ctx.message === "no-perms") {
      await event.reply("You do not have permission to use this command");
      return;
    }
    if (!event.inGuild()) return;
    await event.reply(".. Working on it");

    const q = query(
      collection(db, "verified_info").withConverter(
        typeConverter<VerifiedInfo>()
      ),
      where("email", "==", options.email),
      where("guildid", "==", event.guildId)
    );

    const ssDocs = (await getDocs(q)).docs;
    if (ssDocs.length === 0) {
      await event.editReply("That email info does not exist in the database");
      return;
    }

    const name = ssDocs.map((doc) => doc.data().name)[0];

    await event.editReply(
      `Verified info for the email ${options.email} exists\nName: ${name}`
    );
  },
});
