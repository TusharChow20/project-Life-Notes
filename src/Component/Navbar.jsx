import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Navbar() {
  const navLinks = [
    {
      name: "Add Lessons",
      link: "/dashboard/add-lesson",
    },
    {
      name: "My Lessons",
      link: "/dashboard/my-lessons",
    },
    {
      name: "Public Lessons",
      link: "/dashboard/my-lessons",
    },
    {
      name: "Pricing",
      link: "/dashboard/my-lessons",
    },
  ];
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {navLinks.map((link, index) => (
              <li key={index}>
                <Link href={link.link || "#"}>{link.name}</Link>
              </li>
            ))}
            <div>
              <Link href={"/login"} className="btn">
                Login
              </Link>
            </div>
          </ul>
        </div>
        <Link href={"/"} className="btn btn-ghost text-xl animate-pulse ">
          <Image
            src="/logo.png"
            width={90}
            height={60}
            alt="Digital Life Lessons Logo"
          />
        </Link>
      </div>
      <div className="navbar-end items-center hidden lg:flex ">
        <ul className="menu menu-horizontal px-1">
          {/* <li>Add Lessons</li>
          <li>My Lessons</li>
          <li>Public Lessons</li> */}
          {navLinks.map((link, index) => (
            <li key={index}>
              <Link href={link.link || "#"}>{link.name}</Link>
            </li>
          ))}
        </ul>
        <div>
          <Link href={"/login"} className="btn">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
