import Footer from './Footer'
import { Outlet } from 'react-router-dom'
import Sidebar from '../accountantdashboard/Sidebar';
import DashboardHeader from './DashboardHeader';

function DashboardLayout() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-grow overflow-hidden">
        <Sidebar />

        <main className="flex-grow overflow-hidden">
          <DashboardHeader />
          <Outlet /> {/* Renders the child routes */}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default DashboardLayout