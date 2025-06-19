import { useLocation } from "react-router-dom";
import LoginPage from "./login-page/LoginPage";
import SignupPage from "./sign-up/SignupPage";
import bgImage from "../../assets/bgImage.jpg";


function AuthPage() {
  const location = useLocation();
  const LOGIN = "/login";
  const SIGNUP = "/signup";

  return (
    <div className="flex flex-col gap-0.5 items-center px-6 md:flex-row h-full">
      {/* Left Section */}
      <div
        className="hidden md:block flex-1 min-h-[500px] bg-cover bg-center backdrop-blur-3xl rounded-2xl"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      ></div>

      {/* Right Section */}
      <div className="flex-1/5 flex justify-center items-center rounded-2xl min-h-[500px] bg-white/30 ">
        {location.pathname === LOGIN && <LoginPage />}
        {location.pathname === SIGNUP && <SignupPage />}
      </div>
    </div>
  );
}

export default AuthPage;
