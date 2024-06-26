import {
  Guild,
  UserEmail,
  VerifiedInfo,
  typeConverter,
} from "@/fb/collectiontypes.js";
import { db } from "@/fb/firebase.js";
import { ChannelType, Client, Message } from "discord.js";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { z } from "zod";

const codeschema = z.coerce.number().int().min(1000).max(9999);

export default async function handleDmMessage(
  message: Message,
  client: Client
) {
  if (
    message.channel.type !== ChannelType.DM ||
    message.author.id === client.user?.id
  ) {
    return;
  }

  if (message.author.bot) {
    return;
  }

  try {
    const code = codeschema.parse(message.content);

    const q = query(
      collection(db, "useremails").withConverter(typeConverter<UserEmail>()),
      where("verification_code", "==", code),
      where("userid", "==", message.author.id)
    );

    const ssDocs = (await getDocs(q)).docs;

    if (ssDocs.length === 0) {
      throw new Error("Verification Failed, Please contact admin.");
    }

    const useremail = ssDocs[0].data();

    const akaquery = query(
      collection(db, "verified_info").withConverter(
        typeConverter<VerifiedInfo>()
      ),
      where("email", "==", useremail.email)
    );

    const akaDocs = (await getDocs(akaquery)).docs;

    await setDoc(
      doc(db, "useremails", ssDocs[0].id).withConverter(
        typeConverter<UserEmail>()
      ),
      {
        ...useremail,
        is_verified: true,
        aka: akaDocs.length > 0 ? akaDocs[0].data().name : undefined,
      }
    );

    const guildquery = query(
      collection(db, "guilds").withConverter(typeConverter<Guild>()),
      where("guildid", "==", ssDocs[0].data().guildid)
    );

    const guildss = await getDocs(guildquery);

    if (guildss.docs.length === 0) {
      throw new Error("Guild was not identified. Please contact admin.");
    }

    const guild = guildss.docs[0].data();

    // adds the verified role to the user

    const clientguild = await client.guilds.fetch(useremail.guildid);
    await clientguild.members.fetch(message.author.id).then((member) => {
      if (guild.verifiedrole) {
        member.roles.add(guild.verifiedrole);

        message.reply(
          `Verification Successful, You have been given the verified role for the server \`${clientguild.name}\``
        );
      } else {
        message.reply(
          `Verification Successful, You have been verified but the server does not have a verified role set. Please contact admin.`
        );
      }
    });
  } catch (e) {
    message.reply(`Verification Failed, Please contact admin. + ${e}`);
  }

  console.log(
    `recieved a message! ${message.content} from  ${message.author.id} `
  );
}
