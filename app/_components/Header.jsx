"use client";
import { Button } from "@/components/ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Header = () => {
  const { user, isSignedIn } = useUser();
  const path = usePathname();
  console.log(path)
  return !path.includes('aiform')&&(
    // sticky top-0 bg-white z-50
    <div className="p-5 border-b shadow-sm ">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Image src={"/logo.svg"} alt="logo" width={100} height={100}></Image>
          <p className="text-3xl ">Form Builder</p>
        </div>
        {isSignedIn ? (
          <div className="flex items-center gap-5">
            <Link href="/dashboard">
              <Button variant="outline" className="border-primary text-secondary">Dashboard</Button>
            </Link>
            <UserButton />
          </div>
        ) : (
          <SignInButton>
            <Button>Get Started</Button>
          </SignInButton>
        )}
      </div>
    </div>
  );
};

export default Header;
