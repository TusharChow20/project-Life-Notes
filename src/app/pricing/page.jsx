"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import instance from "@/app/AxiosApi/AxiosInstence";
import { Check, X, Crown, Sparkles } from "lucide-react";
import Swal from "sweetalert2";
import { useState } from "react";

export default function PricingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Fetch user data to check premium status
  const { data: userData, isLoading } = useQuery({
    queryKey: ["user", session?.user?.email],
    queryFn: async () => {
      if (!session?.user?.email) return null;
      const response = await instance.get(`/users?email=${session.user.email}`);
      return response.data;
    },
    enabled: !!session?.user?.email,
  });

  const isPremium = userData?.isPremium || false;

  const handleUpgrade = async () => {
    if (!session) {
      Swal.fire({
        icon: "warning",
        title: "Please Login",
        text: "You need to be logged in to upgrade",
        confirmButtonColor: "#22c55e",
      });
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const response = await instance.post("/create-checkout-session", {
        email: session.user.email,
        userId: userData?._id,
      });

      if (response.data?.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to initiate payment. Please try again.",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Redirect if already premium
  if (isPremium) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card bg-base-200 shadow-xl max-w-md">
          <div className="card-body text-center">
            <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold">You are Already Premium!</h2>
            <p className="opacity-70">
              You have lifetime access to all premium features.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="btn btn-primary mt-4"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const features = [
    {
      feature: "Number of Lessons",
      free: "Up to 10 lessons",
      premium: "Unlimited lessons",
    },
    {
      feature: "Premium Lesson Creation",
      free: false,
      premium: true,
    },
    {
      feature: "Ad-Free Experience",
      free: false,
      premium: true,
    },
    {
      feature: "Priority Listing",
      free: false,
      premium: true,
    },
    {
      feature: "Advanced Analytics",
      free: false,
      premium: true,
    },
    {
      feature: "Custom Branding",
      free: false,
      premium: true,
    },
    {
      feature: "Priority Support",
      free: false,
      premium: true,
    },
    {
      feature: "Export Lessons",
      free: false,
      premium: true,
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-primary font-semibold">Upgrade Today</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg opacity-70 max-w-2xl mx-auto">
            Unlock unlimited potential with our Premium plan. One-time payment,
            lifetime access.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h3 className="text-2xl font-bold mb-2">Free Plan</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">৳0</span>
                <span className="opacity-70 ml-2">Forever</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-success" />
                  <span>Up to 10 lessons</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-success" />
                  <span>Basic features</span>
                </li>
                <li className="flex items-center gap-2">
                  <X className="w-5 h-5 text-error" />
                  <span className="opacity-50">Premium features</span>
                </li>
              </ul>
              <button className="btn btn-outline" disabled>
                Current Plan
              </button>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-primary to-secondary text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <Crown className="w-8 h-8 text-yellow-300" />
            </div>
            <div className="card-body">
              <div className="badge badge-warning gap-2 mb-2">
                <Sparkles className="w-3 h-3" />
                BEST VALUE
              </div>
              <h3 className="text-2xl font-bold mb-2">Premium Plan</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">৳1500</span>
                <span className="ml-2">One-time payment</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  <span>Unlimited lessons</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  <span>All premium features</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  <span>Lifetime access</span>
                </li>
              </ul>
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="btn btn-warning text-black hover:scale-105 transition-transform"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <Crown className="w-5 h-5" />
                    Upgrade to Premium
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="text-3xl font-bold text-center mb-8">
              Feature Comparison
            </h2>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th className="text-lg">Feature</th>
                    <th className="text-lg text-center">Free</th>
                    <th className="text-lg text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Crown className="w-5 h-5 text-yellow-500" />
                        Premium
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((item, index) => (
                    <tr key={index} className="hover">
                      <td className="font-medium">{item.feature}</td>
                      <td className="text-center">
                        {typeof item.free === "boolean" ? (
                          item.free ? (
                            <Check className="w-6 h-6 text-success mx-auto" />
                          ) : (
                            <X className="w-6 h-6 text-error mx-auto" />
                          )
                        ) : (
                          item.free
                        )}
                      </td>
                      <td className="text-center">
                        {typeof item.premium === "boolean" ? (
                          item.premium ? (
                            <Check className="w-6 h-6 text-success mx-auto" />
                          ) : (
                            <X className="w-6 h-6 text-error mx-auto" />
                          )
                        ) : (
                          <span className="font-semibold text-primary">
                            {item.premium}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-center mt-8">
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="btn btn-primary btn-lg"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <Crown className="w-5 h-5" />
                    Choose Premium Plan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
