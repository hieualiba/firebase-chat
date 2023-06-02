import { useRecipient } from "@/hooks/useRecipient";
import { Conversation, IMessage } from "@/types";
import {
  convertFirestoreTimestampToString,
  generateQueryGetMessages,
  transformMessage,
} from "@/utils/getMessagesInConversation";
import { AttachFile, MoreVertSharp } from "@mui/icons-material";
import { Avatar, IconButton, Typography } from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import { useRouter } from "next/router";
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "./Message";
import MoodIcon from "@mui/icons-material/Mood";
import SendIcon from "@mui/icons-material/Send";
import { FormEvent, KeyboardEventHandler, use, useRef, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "@/config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export interface IConversationScreenProps {
  messages: IMessage[];
  conversation: Conversation;
}

export default function ConversationScreen(props: IConversationScreenProps) {
  const { messages, conversation } = props;
  const conversationUsers = conversation.users;

  const { recipient, recipientEmail } = useRecipient(conversationUsers);

  const router = useRouter();
  const conversationId = router.query.id;
  const queryGetMessages = generateQueryGetMessages(conversationId as string);
  const [messagesSnapshot, messagesLoading] = useCollection(queryGetMessages);

  const showMessages = () => {
    if (messagesLoading) {
      return messages.map((message) => (
        <Message key={message.id} message={message} />
      ));
    }

    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message key={message.id} message={transformMessage(message)} />
      ));
    }

    return null;
  };

  const [newMessage, setNewMessage] = useState<string>("");
  const [user] = useAuthState(auth);
  // scroll to bottom
  const endOfMess = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    endOfMess.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addNewMessToDbAndUpdateLastSeen = async () => {
    await setDoc(
      doc(db, "users", user?.email as string),
      {
        lastSeen: serverTimestamp(),
      },
      { merge: true }
    );

    // add new mess to db
    await addDoc(collection(db, "messages"), {
      conversation_id: conversationId,
      sent_at: serverTimestamp(),
      text: newMessage,
      user: user?.email,
    });
    setNewMessage("");
    scrollToBottom();
  };
  const sendNewMess = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMessage) return;
    addNewMessToDbAndUpdateLastSeen();
  };

  // const sendMessOnEnter: KeyboardEventHandler<HTMLInputElement> = (e) => {
  //   if (e.key === "Enter") {
  //     e.preventDefault();
  //     if (newMessage) return;
  //   }
  // };

  return (
    <>
      <div className="bg-white flex-1 py-5 flex flex-col border-2 border-indigo-500/100 border-l-inherit rounded-r-xl">
        <div className="flex items-center justify-between sticky top-0 pb-[20px] px-5 shadow-md">
          <div className="flex items-center">
            {recipient?.photoURL ? (
              <Avatar src={recipient?.photoURL} sx={{ mr: "12px" }} />
            ) : (
              <Avatar sx={{ bgcolor: deepOrange[500], mr: "12px" }}>
                {recipientEmail && recipientEmail[0].toUpperCase()}
              </Avatar>
            )}
            <div>
              <Typography variant="subtitle1" sx={{ wordBreak: "break-all" }}>
                {recipientEmail}
              </Typography>
              {recipient && (
                <Typography variant="body1">
                  Last active:{" "}
                  {convertFirestoreTimestampToString(recipient.lastSeen)}
                </Typography>
              )}
            </div>
          </div>
          <div>
            <IconButton>
              <AttachFile />
            </IconButton>
            <IconButton>
              <MoreVertSharp />
            </IconButton>
          </div>
        </div>

        {/* khung chat */}
        <div className="flex-1 overflow-y-auto">
          {showMessages()}
          <div ref={endOfMess}></div>
        </div>

        {/* imput new mess */}
        <form className="flex bg-white p-[12px]" onSubmit={sendNewMess}>
          <IconButton>
            <MoodIcon />
          </IconButton>
          <input
            className="flex-1 border-none outline-none bg-slate-200 p-[8px] rounded-[8px]"
            placeholder="Enter the message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <IconButton type="submit">
            <SendIcon />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
        </form>
      </div>
    </>
  );
}
