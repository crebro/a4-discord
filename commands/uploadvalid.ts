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
  execute: async ({ event, options }) => {
    if (!event.inGuild()) return;
    await event.reply(".. Working on it");

    const file = await axios.get(options.validuploadfile.url);

    const parser = parse({ from_line: 2 });

    parser.on("readable", function () {
      let record;
      while ((record = parser.read())) {
        addDoc(collection(db, "validemails"), {
          name: record[0],
          email: record[1],
        });
      }
    });

    parser.write(file.data);

    parser.end();
  },
});
