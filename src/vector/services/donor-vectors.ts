import { IProfile } from "../../../types/schema";
import { index } from "../pinecone";

export const upsertVector = async (profile: IProfile) => {
  const record = {
    id: profile._id?.toString()!,
    text: `${profile.name}, Blood Group: ${profile.bloodGroup}, Location: ${profile.location}, DOB: ${profile.dateOfBirth}`,
    bloodGroup: profile.bloodGroup,
    location: profile.location,
    name: profile.name,
    dateOfBirth: profile.dateOfBirth,
  };
  await index.upsertRecords([record]);
};
