"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  FaGoogle,
  FaUserPlus,
  FaEye,
  FaEyeSlash,
  FaUser,
} from "react-icons/fa";
import { MdEmail, MdLock, MdPerson } from "react-icons/md";
import { useForm } from "react-hook-form";

export default function Register() {
  const { register, handleSubmit } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleFormSubmit = (data) => {
    console.log(data);
  };

  const handleGoogleSignup = () => {
    console.log("Google signup clicked");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="card shadow-xl">
          <div className="card-body space-y-4">
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-4">
                <div className="avatar placeholder">
                  <div className="rounded-full w-16 border-2 flex justify-center items-center">
                    <FaUser className="w-8 h-8 text-green-400" />
                  </div>
                </div>
              </div>
              <h1 className="text-3xl font-bold">Create Account</h1>
              <p className="opacity-70">Join us and start your journey today</p>
            </div>

            <button
              onClick={handleGoogleSignup}
              className="btn btn-outline w-full gap-2"
            >
              <FaGoogle className="w-5 h-5 text-green-300" />
              Continue with{" "}
              <span
                className="text-bold text-green-400
              "
              >
                Google
              </span>
            </button>

            <div className="divider">OR</div>
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="space-y-4"
            >
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <label className="input input-bordered flex items-center gap-2 w-full">
                  <MdPerson className="w-5 h-5 opacity-70" />
                  <input
                    type="text"
                    {...register("name", { required: true })}
                    placeholder="John Doe"
                    className="grow"
                    required
                  />
                </label>
              </div>

              {/* Email Input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email Address</span>
                </label>
                <label className="input input-bordered flex items-center gap-2 w-full">
                  <MdEmail className="w-5 h-5 opacity-70" />
                  <input
                    type="email"
                    {...register("email", { required: true })}
                    placeholder="you@example.com"
                    className="grow"
                    required
                  />
                </label>
              </div>

              {/* Password Input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <label className="input input-bordered flex items-center gap-2 w-full">
                  <MdLock className="w-5 h-5 opacity-70" />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", { required: true })}
                    placeholder="Create a strong password"
                    className="grow"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="btn btn-ghost btn-sm btn-circle"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="w-5 h-5" />
                    ) : (
                      <FaEye className="w-5 h-5" />
                    )}
                  </button>
                </label>
              </div>

              {/* Confirm Password Input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Confirm Password</span>
                </label>
                <label className="input input-bordered flex items-center gap-2  w-full">
                  <MdLock className="w-5 h-5 opacity-70" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Re-enter your password"
                    className="grow"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="btn btn-ghost btn-sm btn-circle"
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="w-5 h-5" />
                    ) : (
                      <FaEye className="w-5 h-5" />
                    )}
                  </button>
                </label>
              </div>

              {/* Terms Checkbox */}
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-2">
                  <input type="checkbox" className="checkbox" required />
                  <span className="label-text">
                    I agree to the{" "}
                    <a href="#" className="link">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="link">
                      Privacy Policy
                    </a>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="btn w-full bg-green-500 text-white"
              >
                Create Account
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center pt-4 border-t ">
              <p>
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="link font-semibold text-green-400
                "
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
