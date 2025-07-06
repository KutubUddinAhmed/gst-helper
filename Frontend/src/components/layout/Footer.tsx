import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-2 px-4 z-10 min-w-full 2xl:w-[80vw] 2xl:mx-auto">
      <div className="flex items-center justify-between">
        <p>gstHelper</p> {/* Replace with your application logo */}
        <p>&copy; 2025 My Application</p>
      </div>
    </footer>
  );
};

export default Footer;
