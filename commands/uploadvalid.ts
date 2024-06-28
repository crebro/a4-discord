import { db } from "@/fb/firebase.js";
import { protectedCommand } from "@/utils/dfp.js";
import { options } from "@discord-fp/djs";
import axios from "axios";
import { parse } from "csv-parse";
import { addDoc, collection } from "firebase/firestore";

export default protectedCommand.slash({
  description: "Valid Emails upload | Admin only",
  options: {
    validuploadfile: options.attachment({
      description: "csv file for upload",
      required: true,
    }),
  },
  execute: async ({ event, options, ctx }) => {
    if (ctx.message === "no-perms") {
      await event.reply("You do not have permission to use this command");
      return;
    }
    if (!event.inGuild()) return;
    await event.reply(
      `This may take a while, please check back later.\n
      This message will not update\n
      You are going to have to test this yourself.`
    );

    const file = await axios.get(options.validuploadfile.url);

    const parser = parse();

    parser.on("readable", function () {
      let record;
      record = parser.read();
      if (
        record.length !== 2 ||
        record[0] !== "name" ||
        record[1] !== "email"
      ) {
        return;
      }

      while ((record = parser.read())) {
        if (record.length !== 2 || !record[0] || !record[1]) {
          continue;
        }
        addDoc(collection(db, "verified_info"), {
          name: record[0],
          email: record[1],
          guildid: event.guildId,
        });
      }
    });

    parser.write(file.data);

    parser.end();
  },
});
