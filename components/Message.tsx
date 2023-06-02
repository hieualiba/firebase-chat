import { IMessage } from "@/types";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/config/firebase";

export interface IMessageProps {
  message: IMessage;
}

export default function Message(props: IMessageProps) {
  const { message } = props;
  const [user] = useAuthState(auth);
  const messClassName =
    user?.email === message.user
      ? "ml-auto bg-[#dcf8c6]"
      : "mr-auto bg-[whitesmoke]";

  return (
    <p
      className={`flex flex-col justify-center break-all w-fit min-w-[30%] max-w-[80%] px-[15px] py-[8px] rounded-[8px] m-[8px] ${messClassName}`}
    >
      {message.text}
      <span className="bg-gray text-[10px] ml-auto">{message.sent_at}</span>
    </p>
  );
}
