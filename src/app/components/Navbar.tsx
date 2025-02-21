/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSubscription } from "../hooks/useSubscription";
import { auth } from "../lib/firebase";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

export default function Navbar() {
  const [user, setUser] = useState(auth.currentUser);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const { subscription } = useSubscription(user?.uid || null);

  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside the dropdown to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/");
  };

  const handleSignin = () => {
    setDropdownOpen(!dropdownOpen);
    router.push("/auth");
  };

  const handleSubscribe = () => {
    localStorage.setItem("prevPage", window.location.pathname);
    router.push("/subscribe");
  };

  return (
    <nav className="flex justify-between px-8 py-4 bg-[#FFFBEF] text-[#39210C] border-b border-stone-300">
      {/* Left - Brand Name */}
      <div
        className="font-bold cursor-pointer"
        onClick={() => router.push("/")}
      >
        Ray&apos;s Bookshelf

      </div>

      {/* Right - User Controls */}
      {loading ? (
        <Icon
          icon="eos-icons:loading"
          width="24"
          height="24"
          className="animate-spin"
        />
      ) : (
        <div className="flex flex-end gap-2">
        {!subscription && (
          <div className="">
            <button
              onClick={handleSubscribe}
              className="flex items-center space-x-2 py-1 px-2 rounded text-white bg-[#39210C]"
            >
              Subscribe
            </button>
          </div>
        )}
            {user ? (
            
            
    
              <div className="relative">
                <button
                  className="flex items-center gap-2"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <Icon icon="ei:user" className="text-4xl" />
                  )}
    
                  <Icon icon="mdi:chevron-down" className="text-xl" />
                </button>
    
                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-48  border rounded-lg shadow-md text-sm bg-[#FFFBEF] text-[#39210C]"
                  >
                    <ul className="py-2">
                      <li className="px-4 py-2 text-gray-700">
                        {user.displayName}
                      </li>
                      <li className="border-t"></li>
    
                      {/* Subscription Link */}
                      <li>
                        <Link
                          href="/subscribe"
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          {subscription
                            ? `Plan: ${subscription.plan}`
                            : "Subscribe"}
                        </Link>
                      </li>
    
                      <li className="border-t"></li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Sign Out
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
           
            ) : (
              <button
                onClick={handleSignin}
                className="flex items-center space-x-2 py-1 px-2 rounded border border-[#39210C]"
              >
                Sign In
              </button>
            )}
            </div>
      )}
            
    </nav>
  );
}
