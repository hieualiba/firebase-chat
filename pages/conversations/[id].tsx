import ConversationScreen from "@/components/ConversationScreen";
import Sidebar from "@/components/Sidebar";
import { db } from "@/config/firebase";
import { Conversation, IMessage } from "@/types";
import {
  generateQueryGetMessages,
  transformMessage,
} from "@/utils/getMessagesInConversation";

import { doc, getDoc, getDocs } from "firebase/firestore";
import { GetServerSideProps } from "next";
import { Inter } from "next/font/google";

export interface IConversationProps {
  conversation: Conversation;
  messages: IMessage[];
}

const inter = Inter({ subsets: ["latin"] });

export default function Conversation(props: IConversationProps) {
  const { conversation, messages } = props;

  return (
    <div className={`flex h-screen px-[10%] py-[5%] ${inter.className}`}>
      <Sidebar />
      <ConversationScreen messages={messages} conversation={conversation} />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<
  IConversationProps,
  { id: string }
> = async (context) => {
  const conversationId = context.params?.id;

  // lấy cuộc hội thoại để biết đang chat với ai
  const conversationRef = doc(db, "conversations", conversationId as string);
  const conversationSnapshot = await getDoc(conversationRef);

  // lấy all messages
  const queryMessages = generateQueryGetMessages(conversationId);
  const messagesSnapshot = await getDocs(queryMessages);
  const messages = messagesSnapshot.docs.map((messageDoc) =>
    transformMessage(messageDoc)
  );

  return {
    props: {
      conversation: conversationSnapshot.data() as Conversation,
      messages,
    },
  };
};
