import { Button } from "@/components/ui/button";
import { LibraryBig, LineChart, MessageSquare } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

const SideNav = () => {
  const menuList = [
    {
      id: 1,
      name: "My Forms",
      icon: LibraryBig,
      path: "/dashboard",
    },
    {
      id: 2,
      name: "Responses",
      icon: MessageSquare,
      path: "/dashboard/responses",
    },
    {
      id: 3,
      name: "Analytics",
      icon: LineChart,
      path: "/dashboard/analytics",
    },
    {
      id: 1,
      name: "Shield",
      icon: LibraryBig,
      path: "/dashboard/upgrade",
    },
  ];

  const path = usePathname();
  useEffect(() => {}, [path]);
  return (
    <div className="h-screen shadow-md border">
      <div className="p-5 ">
        {menuList.map((menu, index) => {
          return (
            <Link href={menu.path}
              key={index}
              className={`flex items-center gap-3 p-4 mb-3 hover:bg-primary hover:text-white rounded-lg cursor-pointer text-gray-500 ${
                path === menu.path && "bg-primary text-white"
              }`}
            >
              <menu.icon />
              {menu.name}
            </Link>
          );
        })}
      </div>
      <div className="fixed bottom-7 p-6 w-64">
        <Button className="w-full">+ Create Form</Button>
        <div className="mt-5">
          <Progress value={33} />
          <h2 className="text-sm text-gray-500 mt-2"><strong>2</strong> Out of <strong>5</strong>File Created</h2>
          <h2 className="text-sm text-gray-500 mt-3">Upgrade your plan for unlimited Ai Forms</h2>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
