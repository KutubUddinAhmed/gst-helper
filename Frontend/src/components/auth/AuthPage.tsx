import { useLocation } from "react-router-dom";
import LoginPage from "./login-page/LoginPage";
import SignupPage from "./sign-up/SignupPage";
import logo from "../../assets/logo.avif";
import mainBg from "../../assets/mainbackground.jpg";
function AuthPage() {
  const location = useLocation();
  const LOGIN = "/login";
  const SIGNUP = "/signup";

  return (
    <div
      className="h-[89.7vh] min-w-[97vw] bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url(${mainBg})`,
        backgroundSize: "cover", // Ensures the background covers the entire area
        backgroundPosition: "center", // Centers the background
      }}
    >
      {/* // <div className="h-[89.7vh] bg-gradient-to-r from-purple-500 via-pink-200 to-blue-300 flex items-center justify-center"> */}
      {/* Semi-Transparent Overlay */}
      {/* <div className="absolute inset-0 bg-white/60 -z-10"></div> */}
      {/* Container */}
      {/* <div
        className="childrenContainer rounded-lg max-w-7xl w-[95vw] flex flex-col md:flex-row overflow-hidden sm:h-[50vh] lg:h-[65vh]"
        style={{
          boxShadow: "0 0 10px 12px rgba(255, 255, 255, 0.3)",
        }}
      > */}
      {/* Left Section */}
      {/* <div className="hidden md:block sm: md:w-1/2 flex-1 ">
          <img
            src={mainBg}
            alt="Auth Illustration"
            className="object-cover bg-center h-full w-full"
          />
        </div> */}

      {/* Right Section */}
      {/* <div className="flex-1 flex-col justify-center  md:w-1/2 p-1 ">
          {location.pathname === LOGIN && <LoginPage />}
          {location.pathname === SIGNUP && <SignupPage />}
        </div> */}
      {/* </div> */}

      <div className="flex-1 flex-col justify-center  md:w-1/2 p-1 ">
        {location.pathname === LOGIN && <LoginPage />}
        {location.pathname === SIGNUP && <SignupPage />}
      </div>
    </div>
  );
}

export default AuthPage;
