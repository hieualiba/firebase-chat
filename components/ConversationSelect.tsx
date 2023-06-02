import { useRecipient } from "@/hooks/useRecipient";
import { Conversation } from "@/types";
import { Avatar, Tooltip, Typography } from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import { useRouter } from "next/router";

export interface IConversationSelectProps {
  id: string;
  conversationUsers: Conversation["users"];
}

export default function ConversationSelect(props: IConversationSelectProps) {
  const { id, conversationUsers } = props;
  const { recipient, recipientEmail } = useRecipient(conversationUsers);
  const router = useRouter()
  const selectConversation = () => {
    router.push(`/conversations/${id}`)
  }
  return (
    <Tooltip title="Click to get start chatting" placement="right">
      <div className="flex items-center mt-2 p-2 cursor-pointer hover:bg-[#e9eaeb] rounded-xl" onClick={selectConversation}>
        {recipient?.photoURL ? (
          <Avatar src={recipient?.photoURL} sx={{ mr: "12px" }} />
        ) : (
          <Avatar sx={{ bgcolor: deepOrange[500], mr: "12px" }}>
            {recipientEmail && recipientEmail[0].toUpperCase()}
          </Avatar>
        )}
        <Typography variant="subtitle1" sx={{ wordBreak: "break-all" }}>
          {recipientEmail}
        </Typography>
      </div>
    </Tooltip>
  );
}
