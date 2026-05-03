import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import User from "../models/user.model.js";
import { deleteStreamUser, upsertStreamUsers } from "./stream.js";


export const inngest = new Inngest({ id: "CodeInterviewX" });

const syncUser = inngest.createFunction(
  {
    id: "sync-user",
    triggers: [{ event: "clerk/user.created" }]
  },
  async ({ event }) => {
    await connectDB();

    const { id, email_addresses, first_name, last_name, image_url } = event.data;

    const newUser = {
      clerkId: id,
      email: email_addresses[0]?.email_address,  // get first email
      name: `${first_name || ""} ${last_name || ""}`,
      profileImage: image_url,
    };

    await User.create(newUser);

    await upsertStreamUsers({
      id:newUser.clerkId.toString(),
      name:newUser.name,
      image:newUser.profileImage
    })
  }
);

const deleteUser = inngest.createFunction(
  {
    id: "delete-user-from-db",
    triggers: [{ event: "clerk/user.deleted" }]
  },
  async ({ event }) => {
    await connectDB();

    const { id } = event.data;
    await User.deleteOne({ clerkId: id });

    await deleteStreamUser(id.toString());
  }
);

export const functions = [syncUser, deleteUser];