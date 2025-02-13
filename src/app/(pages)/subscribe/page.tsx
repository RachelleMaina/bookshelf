/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, updateSubscription } from "../../lib/firebase";
import { Icon } from "@iconify/react";
import { useSubscription } from "@/app/hooks/useSubscription";
import Loader from "@/app/components/Loader";

declare global {
  interface Window {
    IntaSend?: any; // Or use a proper type if available
  }
}

export const dynamic = "force-dynamic"; // Disable prerendering

export default function SubscribePage() {
  const [user, setUser] = useState(auth.currentUser);
  const [selectedPlan, setSelectedPlan] = useState("weekly");
  const [intasendInstance, setIntasendInstance] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();

  const { subscription,loading } = useSubscription(user?.uid || null);

  const plans: Record<string, { price: number; label: string; save?: string }> =
    {
      weekly: { price: 60, label: "Weekly Subscription" },
      monthly: {
        price: 200,
        label: "Monthly Subscription",
        save: "Save Ksh. 40",
      },
    };

  useEffect(() => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("intasend-inlinejs-sdk");

      if (window.IntaSend) {
        const intasend = window.IntaSend({
          publicAPIKey: process.env.NEXT_PUBLIC_INTASEND_KEY,
          live: true,
          redirect_url:"https://bookshelf-three-rho.vercel.app/subscribe"
        });
        setIntasendInstance(intasend);
      }
      const params = new URLSearchParams(window.location.search);
      setSuccess(params.get("success"));
    }

    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  async function openCheckout() {
    if (!user) {
      localStorage.setItem("prevPage", window.location.pathname);
      router.push("/auth");
      return;
    }

    // const email = user.email || "";
    // const [firstName, lastName] = user.displayName?.split(" ") || ["", ""];
    setIsProcessing(true);
    intasendInstance
      .on("COMPLETE", async () => {
        setIsProcessing(false);

        // Update subscription
        const subscription = {
          plan: selectedPlan,
          expiresAt:
            new Date().getTime() +
            (selectedPlan === "weekly" ? 7 : 30) * 24 * 60 * 60 * 1000,
        };
        await updateSubscription(user.uid, subscription.plan);

 
        // Redirect user to previous page
        const prevPage = localStorage.getItem("prevPage") || "/";
        localStorage.removeItem("prevPage");
        router.replace(prevPage);
      })
      .on("FAILED", () => {
        setIsProcessing(false);
        setError("Payment failed. Please try again.");
      });
    
      intasendInstance.run({
        amount: plans[selectedPlan].price,
        currency: "KES",
      });
  }

  const goBack = () => {
    // Redirect user to previous page
    const prevPage = localStorage.getItem("prevPage") || "/";
    localStorage.removeItem("prevPage");
    router.replace(prevPage);
  };



  return (
    loading ? <Loader/>:
    <div className="p-8 bg-[#FFFBEF] text-[#39210C] rounded-lg mt-10 flex flex-col items-center">
      <div className="md:w-1/2">
        {success && subscription ? (
          <div className="text-center">
            <div className="flex items-center justify-center bg-green-100 text-green-700 p-4 rounded-lg">
              <Icon icon="ri:checkbox-circle-fill" className="w-8 h-8 mr-2" />
              <h2 className="text-xl font-bold">Subscription Successful!</h2>
            </div>
            <p className="text-lg mt-4">You are now subscribed to the:</p>
            <p className="text-xl font-semibold capitalize">
              {subscription.plan} plan
            </p>
            <p className="mt-2 text-sm text-gray-700">
              Expires on:{" "}
              <strong>
                {new Date(subscription.expiresAt).toLocaleDateString()}
              </strong>
            </p>
            <button
              onClick={goBack}
              className="mt-6 px-6 py-3 bg-[#39210C] text-white font-semibold rounded-lg hover:bg-[#4e2c12]"
            >
              Go Back
            </button>
          </div>
        ) : subscription ? (
          <div className="text-center">
            <h2 className="text-xl font-bold">Your Subscription</h2>
            <p className="text-lg mt-4">
              Plan: <strong>{subscription.plan}</strong>
            </p>
            <p className="text-sm text-gray-700">
              Expires on:{" "}
              <strong>
                {new Date(subscription.expiresAt).toLocaleDateString()}
              </strong>
            </p>
            <button
              onClick={() => router.push("/")}
              className="mt-6 px-6 py-3 bg-[#39210C] text-white font-semibold rounded-lg hover:bg-[#4e2c12]"
            >
              Go to Home
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-center mb-2">
              Enjoy free previews, subscribe for full access.
            </h1>
            <p className="text-center mb-6">
              Choose a plan and continue reading uninterrupted.
            </p>

            <div className="space-y-4">
              {Object.entries(plans).map(([key, plan]) => (
                <label
                  key={key}
                  className={`block p-4 border rounded-lg cursor-pointer ${
                    selectedPlan === key
                      ? "border-blue-600 bg-blue-100"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="plan"
                    value={key}
                    checked={selectedPlan === key}
                    onChange={() => setSelectedPlan(key)}
                    className="hidden"
                  />
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{plan.label}</span>
                      {plan.save && (
                        <div className="text-sm text-green-600 font-semibold">
                          {plan.save}
                        </div>
                      )}
                    </div>
                    <span className="font-semibold">Ksh. {plan.price}</span>
                  </div>
                </label>
              ))}
            </div>
            {error && <div className="text-red-500 w-full">{error}</div>}
            <button
              className="w-full mt-6 py-3 bg-[#39210C] text-white font-semibold rounded-lg hover:bg-[#4e2c12] disabled:opacity-50"
              onClick={openCheckout}
              disabled={isProcessing}
            >
              {isProcessing
                ? "Processing..."
                : `Subscribe for Ksh. ${plans[selectedPlan].price}`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}