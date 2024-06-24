import { UserEmail, typeConverter } from "@/fb/collectiontypes.js";
import { db } from "@/fb/firebase.js";
import mailsender from "@/utils/emailsender.js";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { z } from "zod";

const emailschema = z.string().email();

interface verifyquery {
  email: string;
  guildid: string;
  userid: string;
}

export default async function verifyprocess(query: verifyquery) {
  // check if email is valid
  const email = emailschema.parse(query.email);

  const code = Math.floor(1000 + Math.random() * 9000);

  // get guild fire firestore
  const guild = await getDoc(doc(db, "guilds", query.guildid));
  if (!guild.exists()) {
    return;
  }

  if (guild.data().domain && !email.endsWith(guild.data().domain)) {
    throw new Error("Email domain does not match guild domain");
  }

  if (
    (
      await getDoc(
        doc(db, "useremails", `${query.guildid}-${email}`).withConverter(
          typeConverter<UserEmail>()
        )
      )
    ).exists()
  ) {
    throw new Error("Email already exists");
  }

  await setDoc(
    doc(db, "useremails", `${query.guildid}-${email}`).withConverter(
      typeConverter<UserEmail>()
    ),
    {
      email: email,
      guildid: query.guildid,
      userid: query.userid,
      is_verified: false,
      verification_code: code,
    }
  );

  await mailsender.sendEmail(email, code, "Email Verification", true, () => {});
}
