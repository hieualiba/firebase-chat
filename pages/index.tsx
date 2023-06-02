import { Inter } from "next/font/google";
import Sidebar from "../components/Sidebar";
import ConversationScreen from "@/components/ConversationScreen";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className={`flex h-screen px-[10%] py-[5%] ${inter.className}`}>
      <Sidebar />
      <div className="bg-white flex-1 py-5 flex flex-col border-2 border-indigo-500/100 border-l-inherit rounded-r-xl"></div>
    </div>
  );
}
