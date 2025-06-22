import { useAuth } from "../../AppProvider";
const AccountantDashboard = () => {

  const {auth} = useAuth()
  return (
    <div className="h-full bg-[#fff]">
      <div>USer : {auth?.userRole || "Guest"}</div>
    </div>
  );
};

export default AccountantDashboard;
