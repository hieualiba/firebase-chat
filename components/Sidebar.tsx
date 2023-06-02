import { Avatar } from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import ChatIcon from "@mui/icons-material/Chat";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import { MoreVertSharp } from "@mui/icons-material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { auth, db } from "@/config/firebase";
import * as EmailValidator from "email-validator";
import {
  addDoc,
  collection,
  query,
  where,
  getFirestore,
} from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { Conversation } from "@/types";
import ConversationSelect from "./ConversationSelect";

export interface ISidebarProps {}

export default function Sidebar(props: ISidebarProps) {
  const [user, _loading, _error] = useAuthState(auth);

  const [signOut, __loading, __error] = useSignOut(auth);
  const handleLogout = () => {
    signOut();
  };
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [recipientEmail, setRecipientEmail] = useState<string>("");

  const isMoiBanThan = recipientEmail === user?.email;

  const queryConversationForCurentUser = query(
    collection(db, "conversations"),
    where("users", "array-contains", user?.email)
  );
  const [conversationList, loading, error] = useCollection(
    queryConversationForCurentUser
  );

  const isConversationExisted = (recipientEmail: string) => {
    return conversationList?.docs.find((conversation) =>
      (conversation.data() as Conversation).users.includes(recipientEmail)
    );
  };
  const resetFormDialog = () => {
    setShowDialog(false);
    setRecipientEmail("");
  };
  const handleCloseDialog = () => {
    resetFormDialog();
  };
  const handleConfirmDialog = async () => {
    if (!recipientEmail) return;
    if (
      EmailValidator &&
      !isMoiBanThan &&
      !isConversationExisted(recipientEmail)
    ) {
      await addDoc(collection(db, "conversations"), {
        users: [user?.email, recipientEmail],
      });
    }
    resetFormDialog();
  };
  return (
    <div className="min-w-[350px] bg-white p-5 border-2 border-indigo-500/100 rounded-l-xl">
      <div className="flex flex-col sticky top-0">
        <div className="flex justify-between">
          <Tooltip title={user?.email} placement="right">
            <Avatar
              alt={user?.email as string}
              src={user?.photoURL as string}
              sx={{ bgcolor: deepOrange[500] }}
            >
              {user?.email && user?.email[0].toUpperCase()}
            </Avatar>
          </Tooltip>
          <div>
            <IconButton>
              <ChatIcon />
            </IconButton>
            <IconButton>
              <MoreVertSharp />
            </IconButton>
            <IconButton onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </div>
        </div>
        <div className="mt-10 border-solid border-2 border-indigo-600 rounded-3xl">
          <IconButton>
            <SearchIcon />
          </IconButton>
          <input
            type="text"
            placeholder="Search in conversation"
            className="border-none bg-inherit outline-none pt-2 pb-2"
          />
        </div>
        <Button
          variant="outlined"
          sx={{ mt: "8px" }}
          color="secondary"
          onClick={() => setShowDialog(true)}
        >
          Start a new conversation
        </Button>
        <Dialog open={showDialog} onClose={handleCloseDialog}>
          <DialogTitle>New Conversation</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter a Google email adress for the user you wish to chat
              with.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email Address"
              type="email"
              fullWidth
              variant="standard"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button disabled={!recipientEmail} onClick={handleConfirmDialog}>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      {conversationList?.docs.map((item) => (
        <ConversationSelect
          key={item.id}
          id={item.id}
          conversationUsers={(item.data() as Conversation).users}
        />
      ))}
    </div>
  );
}
