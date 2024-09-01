"use client";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";

const Header = () => {
  const { user, isSignedIn } = useUser();
  return (
    // sticky top-0 bg-white z-50
    <div className="p-5 border-b shadow-sm ">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Image src={"/logo.svg"} alt="logo" width={100} height={100}></Image>
          <p className="text-3xl ">Form Builder</p>
        </div>
        {isSignedIn ? (
          <div className="flex items-center gap-5">
            <Button variant="outline">Dashboard</Button>
            <UserButton />
          </div>
        ) : (
          <div>
            <Button>Get Started</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
