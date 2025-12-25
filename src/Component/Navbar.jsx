"use client";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import instance from "@/app/AxiosApi/AxiosInstence";
import { Crown } from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Fetch user data to check premium status
  const { data: userData } = useQuery({
    queryKey: ["user", session?.user?.email],
    queryFn: async () => {
      if (!session?.user?.email) return null;
      const response = await instance.get(`/users?email=${session.user.email}`);
      return response.data;
    },
    enabled: !!session?.user?.email,
  });

  const isPremium = userData?.isPremium || false;

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await signOut({ callbackUrl: "/login" });
    }
  };

  // Base nav links
  const baseNavLinks = [
    {
      name: "Add Lessons",
      link: "/dashboard/add-lesson",
    },
    {
      name: "My Lessons",
      link: "/dashboard/my-lesson",
    },
    {
      name: "Public Lessons",
      link: "/public-lessons",
    },
  ];

  const navLinks = isPremium
    ? baseNavLinks
    : [
        ...baseNavLinks,
        {
          name: "Pricing",
          link: "/pricing",
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[999] mt-3 w-52 p-2 shadow"
          >
            {navLinks.map((link, index) => (
              <li key={index}>
                <Link href={link.link || "#"}>{link.name}</Link>
              </li>
            ))}

            {/* Mobile Auth Section */}
            <div className="divider my-2"></div>
            {status === "loading" ? (
              <li className="px-4 py-2">
                <span className="loading loading-spinner loading-sm"></span>
              </li>
            ) : (
              session && (
                <>
                  <li className="menu-title px-4">
                    <span className="text-xs wrap-anywhere flex items-center gap-2">
                      {isPremium && (
                        <Crown className="w-4 h-4 text-yellow-500" />
                      )}
                      {session.user.email}
                    </span>
                  </li>
                  <li>
                    <Link href="/profile">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <button onMouseDown={handleLogout} className="text-error">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Logout
                    </button>
                  </li>
                </>
              )
            )}
          </ul>
        </div>

        <Link href={"/"} className="btn btn-ghost text-xl animate-pulse">
          <Image
            src="/logo.png"
            width={90}
            height={60}
            alt="Digital Life Lessons Logo"
          />
        </Link>
      </div>

      <div className="navbar-end items-center hidden lg:flex gap-2">
        <ul className="menu menu-horizontal px-1">
          {navLinks.map((link, index) => (
            <li key={index}>
              <Link href={link.link || "#"}>{link.name}</Link>
            </li>
          ))}
        </ul>

        {status === "loading" ? (
          <div className="flex items-center gap-2 px-4">
            <span className="loading loading-spinner loading-sm"></span>
          </div>
        ) : session ? (
          <div className="flex items-center gap-3">
            {isPremium && (
              <div className="badge badge-warning gap-2">
                <Crown className="w-4 h-4" />
                Premium
              </div>
            )}

            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className="btn btn-ghost btn-circle avatar placeholder"
              >
                <div
                  className={`w-10 rounded-full ${
                    isPremium
                      ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                      : "bg-green-500"
                  } text-white`}
                >
                  <span className="text-lg font-bold">
                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
              </label>
              <ul
                tabIndex={0}
                className="mt-3 z-[999] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
              >
                <li className="menu-title">
                  <span>Logged in as</span>
                </li>
                <li className="disabled px-4 py-2">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold flex items-center gap-2">
                      {session.user.name}
                      {isPremium && (
                        <Crown className="w-4 h-4 text-yellow-500" />
                      )}
                    </span>
                    <span className="text-xs opacity-70">
                      {session.user.email}
                    </span>
                    {isPremium && (
                      <span className="badge badge-warning badge-sm mt-1">
                        Premium Member
                      </span>
                    )}
                  </div>
                </li>
                <div className="divider my-1"></div>
                <li>
                  <Link href="/profile">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Profile
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button onMouseDown={handleLogout} className="text-error">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link href="/login" className="btn btn-ghost btn-sm">
              Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
