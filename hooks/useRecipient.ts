import { auth, db } from "@/config/firebase";
import { AppUser, Conversation } from "@/types";
import { getRecipientEmail } from "@/utils/getRecipientEmail";
import { collection, query, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";

export const useRecipient = (conversationUsers: Conversation["users"]) => {
  const [user] = useAuthState(auth);
  const recipientEmail = getRecipientEmail(conversationUsers, user);
  const queryGetRecipient = query(
    collection(db, "users"),
    where("email", "==", recipientEmail)
  );
  const [recipientsSnapShot] = useCollection(queryGetRecipient);

  // user chưa từng đăng nhập vào hệ thống thì là []
  const recipient = recipientsSnapShot?.docs[0]?.data as AppUser | undefined;

  return { recipient, recipientEmail };
};
