import { Firestore, FirestoreDataConverter } from "firebase/firestore";

type Guild = {
  guildid: string;
  verifiedrole?: string;
  unverifiedrole?: string;
  channelid?: string;
  messageid?: string;
  domain?: string;
  grade11role?: string;
  grade12role?: string;
  mod: string;
};

type UserEmail = {
  email: string;
  guildid: string;
  userid: string;
  is_verified: boolean;
  verification_code: number;
  aka?: string;
};

type VerifiedInfo = {
  name: string;
  email: string;
  guildid: string;
};

export function typeConverter<T>(): FirestoreDataConverter<T> {
  const item: FirestoreDataConverter<T> = {
    toFirestore: (data) => data,
    fromFirestore: (snap) => snap.data() as T,
  };

  return item;
}

export type { Guild, UserEmail, VerifiedInfo };
