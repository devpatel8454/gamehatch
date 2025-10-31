import React from "react";
import { Outlet } from "react-router";
import Navbar from "../Header/Navbarr";

export const MainLayout = () => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Navbar />
      <div className="min-h-screen bg-transparent">
        <Outlet />
      </div>
    </div>
  );
};
