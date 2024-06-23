import { protectedCommand } from "@/utils/dfp.js";
import { options } from "@discord-fp/djs";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/fb/firebase.js";
import { UserEmail, typeConverter } from "@/fb/collectiontypes.js";

export default protectedCommand.slash({
  description: "View verified emails on a member",
  options: {
    member: options.user({ description: "The member to view" }),
  },
  execute: async ({ event, options, ctx }) => {
    if (ctx.message === "no-perms") {
      await event.reply("You do not have permission to use this command");
      return;
    }
    if (!event.inGuild()) return;
    await event.reply(".. Working on it");

    const q = query(
      collection(db, "useremails").withConverter(typeConverter<UserEmail>()),
      where("userid", "==", options.member.value.id),
      where("guildid", "==", event.guildId),
      where("is_verified", "==", true)
    );

    const ssDocs = (await getDocs(q)).docs;
    if (ssDocs.length === 0) {
      await event.editReply(
        "The user does not seem be verified with any emails"
      );
      return;
    }

    const useremails = ssDocs.map((doc) => doc.data());

    await event.editReply(
      "This user has the following emails verified: \n" +
        useremails.map((useremails) => useremails.email).join("\n")
    );
  },
});
