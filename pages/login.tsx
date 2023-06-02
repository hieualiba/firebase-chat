import Button from "@mui/material/Button";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "@/config/firebase";

export interface ILoginProps {}

export default function Login(props: ILoginProps) {
  const [signInWithGoogle, _user, _loading, _error] = useSignInWithGoogle(auth);
  const handleLoginWithGG = () => {
    signInWithGoogle()
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <Button variant="outlined" color="secondary" onClick={handleLoginWithGG}>
        Đăng nhập với Google
      </Button>
    </div>
  );
}


