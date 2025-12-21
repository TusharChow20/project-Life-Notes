"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import instance from "@/app/AxiosApi/AxiosInstence";
import { CheckCircle, Crown, Sparkles, Loader2 } from "lucide-react";
import confetti from "canvas-confetti";

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get("session_id");
      const userId = searchParams.get("user_id");

      if (!sessionId || !userId) {
        setError("Missing payment information");
        setVerifying(false);
        return;
      }

      try {
        // Call verify-payment endpoint
        const response = await instance.post("/verify-payment", {
          sessionId: sessionId,
          userId: userId,
        });

        if (response.data.success) {
          // Trigger confetti celebration
          const duration = 3 * 1000;
          const end = Date.now() + duration;

          const frame = () => {
            confetti({
              particleCount: 2,
              angle: 60,
              spread: 55,
              origin: { x: 0 },
              colors: ["#22c55e", "#facc15", "#3b82f6"],
            });
            confetti({
              particleCount: 2,
              angle: 120,
              spread: 55,
              origin: { x: 1 },
              colors: ["#22c55e", "#facc15", "#3b82f6"],
            });

            if (Date.now() < end) {
              requestAnimationFrame(frame);
            }
          };
          frame();

          // Invalidate user query to refetch updated data
          queryClient.invalidateQueries(["user", session?.user?.email]);

          setTimeout(() => {
            setVerifying(false);
          }, 1500);
        } else {
          setError(response.data.message || "Payment verification failed");
          setVerifying(false);
        }
      } catch (err) {
        console.error("Error verifying payment:", err);
        setError(
          err.response?.data?.message ||
            "Failed to verify payment. Please contact support."
        );
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, session, queryClient]);

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto" />
          <h2 className="text-2xl font-bold">Processing your payment...</h2>
          <p className="text-lg opacity-70">
            Please wait while we verify your premium upgrade
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card bg-base-200 shadow-xl max-w-md">
          <div className="card-body text-center">
            <div className="text-error text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold">Payment Verification Error</h2>
            <p className="opacity-70">{error}</p>
            <div className="space-y-2 mt-4">
              <p className="text-sm">
                If you were charged, don't worry! Please contact our support
                team with your transaction details.
              </p>
              <button
                onClick={() => router.push("/pricing")}
                className="btn btn-primary w-full"
              >
                Back to Pricing
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="btn btn-ghost w-full"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card bg-gradient-to-br from-primary to-secondary text-white shadow-2xl max-w-2xl w-full">
        <div className="card-body text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <Crown className="w-24 h-24 text-yellow-300 animate-bounce" />
              <Sparkles className="w-8 h-8 text-yellow-200 absolute -top-2 -right-2 animate-pulse" />
            </div>
          </div>

          <CheckCircle className="w-16 h-16 mx-auto text-success" />

          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Payment Successful!</h1>
            <p className="text-xl opacity-90">
              Welcome to Premium Membership 🎉
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 space-y-3">
            <p className="text-lg font-semibold">You now have access to:</p>
            <ul className="space-y-2 text-left max-w-md mx-auto">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                <span>Unlimited lessons</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                <span>Premium lesson creation</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                <span>Ad-free experience</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                <span>Priority support</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                <span>All premium features - Forever!</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="btn btn-warning text-black flex-1"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => router.push("/lessons")}
              className="btn btn-outline text-white hover:bg-white hover:text-black flex-1"
            >
              Start Learning
            </button>
          </div>

          <p className="text-sm opacity-70 pt-4">
            A confirmation email has been sent to your registered email address.
          </p>
        </div>
      </div>
    </div>
  );
}
