import mailsender from "@/utils/emailsender.js";
import prisma from "@/utils/prisma.js";
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

    await prisma.useremails.create({
        data: {
            email: email,
            guildid: query.guildid,
            userid: query.userid,
            is_verified: false,
            verification_code: code,
        }
    });

    await mailsender.sendEmail(email, code, "Email Verification", true, () => {});
}