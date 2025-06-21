import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white  py-2 px-4 text-center z-100">
      <div className="flex items-center justify-between"> 
        <p>gstHelper</p> {/* Replace with your application logo */}
        <p>&copy; 2025 My Application</p>
      </div>
    </footer>
  );
};

export default Footer;
