import { Firestore, FirestoreDataConverter } from "firebase/firestore";

type Guild = {
  guildid: string;
  verifiedrole: string | undefined;
  unverifiedrole: string | undefined;
  channelid: string | undefined;
  messageid: string | undefined;
};

type UserEmail = {
  email: string;
  guildid: string;
  userid: string;
  is_verified: boolean;
  verification_code: number;
};

export function typeConverter<T>(): FirestoreDataConverter<T> {
  const item: FirestoreDataConverter<T> = {
    toFirestore: (data) => data,
    fromFirestore: (snap) => snap.data() as T,
  };

  return item;
}

export type { Guild, UserEmail };
