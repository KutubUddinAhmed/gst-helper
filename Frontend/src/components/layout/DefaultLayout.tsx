import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function DefaultLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
     <Header />
      {/* Main Content Section */}
      <main className="flex-grow h-full ">
        <Outlet />
      </main>
      {/* Footer Section */}
     <Footer />
    </div>
  );
}

export default DefaultLayout;
