import Image from "next/image";
import React from "react";

export default function Footer() {
  return (
    <footer
      className="footer sm:footer-horizontal shadow-2xl border-t-2 border-green-200
     text-base-content p-10"
    >
      <aside>
        <div className="relative w-[180px] h-[90px]">
          <Image
            src="/logo.png"
            alt="Company Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <p>
          Tushar Co.
          <br />
          Providing reliable tech service since 2002
        </p>
      </aside>
      <nav>
        <h6 className="footer-title">Services</h6>
        <a className="link link-hover">Branding</a>
        <a className="link link-hover">Design</a>
        <a className="link link-hover">Marketing</a>
        <a className="link link-hover">Advertisement</a>
      </nav>
      <nav>
        <h6 className="footer-title">Company</h6>
        <a className="link link-hover">About us</a>
        <a className="link link-hover">Contact</a>
        <a className="link link-hover">Jobs</a>
        <a className="link link-hover">Press kit</a>
      </nav>
      <nav>
        <h6 className="footer-title">Legal</h6>
        <a className="link link-hover">Terms of use</a>
        <a className="link link-hover">Privacy policy</a>
        <a className="link link-hover">Cookie policy</a>
      </nav>
    </footer>
  );
}
