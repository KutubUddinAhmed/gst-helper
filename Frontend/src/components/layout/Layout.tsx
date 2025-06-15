import Footer from './Footer'
import { Outlet } from 'react-router-dom'
import Sidebar from '../accountantdashboard/Sidebar';

function Layout() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-grow overflow-hidden">
        <Sidebar />
        <main className="flex-grow p-4 overflow-auto">
          <Outlet /> {/* Renders the child routes */}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default Layout