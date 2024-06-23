import { UserEmail, typeConverter } from "@/fb/collectiontypes.js";
import { db } from "@/fb/firebase.js";
import mailsender from "@/utils/emailsender.js";
import { doc, setDoc } from "firebase/firestore";
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

  await setDoc(
    doc(
      db,
      "useremails",
      `${query.guildid}-${query.userid}-${email}`
    ).withConverter(typeConverter<UserEmail>()),
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
