import { db } from "@/config/firebase";
import { IMessage } from "@/types";
import {
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
  collection,
  orderBy,
  query,
  where,
} from "firebase/firestore";

export const generateQueryGetMessages = (conversationId?: string) =>
  query(
    collection(db, "messages"),
    where("conversation_id", "==", conversationId),
    orderBy("sent_at", "asc")
  );

export const transformMessage = (
  messageDoc: QueryDocumentSnapshot<DocumentData>
) => ({
  id: messageDoc.id,
  ...messageDoc.data(),
  sent_at: messageDoc.data().sent_at
    ? convertFirestoreTimestampToString(messageDoc.data().sent_at as Timestamp)
    : null,
} as IMessage);

export const convertFirestoreTimestampToString = (timeStamp: Timestamp) =>
  new Date(timeStamp.toDate().getTime()).toLocaleString();
