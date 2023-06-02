import { Conversation } from "@/types";
import { User } from "firebase/auth";

export const getRecipientEmail = (
  conversationUsers: Conversation["users"],
  logInUser?: User | null
) => conversationUsers.find((email) => email !== logInUser?.email);
