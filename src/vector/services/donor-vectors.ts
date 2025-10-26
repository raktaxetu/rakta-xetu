import { IProfile } from "../../../types/schema";
import { index } from "../pinecone";

export const upsertVector = async (profile: IProfile) => {
  const record = {
    id: profile._id?.toString()!,
    text: `${profile.name}, Blood Group: ${profile.bloodGroup}, Location: ${profile.location}, DOB: ${profile.dateOfBirth}`,
  };
  await index.upsertRecords([record]);
};
