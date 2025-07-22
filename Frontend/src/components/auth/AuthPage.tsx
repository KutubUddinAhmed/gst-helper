import { useLocation } from "react-router-dom";
import LoginPage from "./login-page/LoginPage";







function AuthPage() {
  const location = useLocation();
  const LOGIN = "/login";
  // const SIGNUP = "/signup";

  return (
    <div className="h-[91vh] sm:h-[92vh] lg:h-[89vh] flex items-center justify-center ">
      <div className="">{location.pathname === LOGIN && <LoginPage />}</div>
    </div>
  );
}

export default AuthPage;
