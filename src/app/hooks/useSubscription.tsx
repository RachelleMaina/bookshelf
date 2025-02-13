"use client"
import { useEffect, useState } from "react";
import { getSubscription, Subscription } from "../lib/firebase";

export function useSubscription(userId: string | null) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    } 

  
      // Fallback: Fetch from Firestore
    async function fetchSubscription() {
      if (userId) {
        const dbSubscription = await getSubscription(userId);
        setSubscription(dbSubscription);
        setLoading(false);
      }
    }

    fetchSubscription();
  }, [userId]);

  return { subscription, loading };
}
