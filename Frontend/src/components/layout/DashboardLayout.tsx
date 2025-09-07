import { Outlet } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import { SidebarProvider } from "../../../components/components/ui/sidebar"
import { AppSidebar } from "../accountantdashboard/appSidebar"

function DashboardLayout() {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex flex-col h-screen w-full">
        {/* Sidebar and Main Content */}
        <div className="flex flex-grow gap-0 overflow-hidden">
          {/* Sidebar */}
          <AppSidebar />
          {/* Main Content */}
          <main className="flex flex-col w-full">
              <DashboardHeader />
              <Outlet />
          </main>
        </div>

        {/* Footer */}
        {/* <Footer /> */}
      </div>
    </SidebarProvider>
  );
}

export default DashboardLayout;
