"use client";
import { useRouter } from "next/navigation";
import { XCircle, ArrowLeft, CreditCard } from "lucide-react";

export default function PaymentCancel() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card bg-base-200 shadow-xl max-w-md w-full">
        <div className="card-body text-center space-y-6">
          <XCircle className="w-20 h-20 text-warning mx-auto" />

          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Payment Cancelled</h1>
            <p className="opacity-70">
              Your payment was cancelled. No charges were made.
            </p>
          </div>

          <div className="bg-base-300 rounded-lg p-4 space-y-2">
            <p className="text-sm opacity-70">
              Don't worry! You can try again anytime. Your premium upgrade is
              just one click away.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <button
              onClick={() => router.push("/pricing")}
              className="btn btn-primary gap-2"
            >
              <CreditCard className="w-5 h-5" />
              Try Again
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="btn btn-ghost gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </button>
          </div>

          <div className="divider">Need Help?</div>

          <p className="text-sm opacity-70">
            If you encountered any issues, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}
