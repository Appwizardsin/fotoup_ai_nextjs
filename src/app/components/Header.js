"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  FiMenu,
  FiX,
  FiUser,
  FiChevronDown,
  FiLogOut,
  FiZap,
  FiImage,
  FiCreditCard,
} from "react-icons/fi";
import { FaCoins } from "react-icons/fa";

const Header = () => {
  const { user, signOut, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const isFreePlan = !user?.hasSubscription;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-gray-800 shadow-md relative">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              width={150}
              height={35}
              src="/fotup_logo.png" // Assuming the image is named logo.png and is in the public folder
              alt="Logo"
              className="md:w-[150px] md:h-[35px] w-[80px] h-[20px] object-contain"
            />
          </Link>

          {/* Mobile Menu Button and Credits */}
          <div className="md:hidden flex items-center gap-3">
            {!loading && user && (
              <>
                <div className="flex items-center gap-2 px-2 py-1 bg-gray-700 rounded-full text-sm">
                  <FaCoins className="text-yellow-400 w-3 h-3" />
                  <span className="text-white font-medium">
                    {user.credits || 0}
                  </span>
                </div>
                {isFreePlan && (
                  <Link
                    href="/subscription"
                    className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:from-purple-700 hover:to-blue-700 transition-all text-sm"
                  >
                    <FiZap className="w-3 h-3" />
                    <span className="font-medium">Upgrade</span>
                  </Link>
                )}
              </>
            )}
            <button
              onClick={toggleMenu}
              className="text-white hover:text-gray-300"
            >
              {isMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-4 items-center">
            <Link href="/search" className="text-white hover:text-gray-300">
              Search
            </Link>
            {loading ? (
              <div className="w-[200px] h-[40px] bg-gray-700 animate-pulse rounded-lg"></div>
            ) : user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/my-images"
                  className="text-white hover:text-gray-300"
                >
                  My Images
                </Link>

                {/* Credits Display */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 rounded-full">
                  <FaCoins className="text-yellow-400 w-4 h-4" />
                  <span className="text-white font-medium">
                    {user.credits || 0}
                  </span>
                </div>

                {/* Upgrade Button for Free Plan */}
                {isFreePlan && (
                  <Link
                    href="/subscription"
                    className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:from-purple-700 hover:to-blue-700 transition-all"
                  >
                    <FiZap className="w-4 h-4" />
                    <span className="font-medium">Upgrade</span>
                  </Link>
                )}

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <FiUser className="text-white" />
                    </div>
                    <FiChevronDown
                      className={`text-gray-400 transition-transform ${
                        isProfileOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-2 border border-gray-700 z-50">
                      <Link
                        href="/my-subscription"
                        className="flex items-center gap-2 px-4 py-2 text-white hover:bg-gray-700"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <FiCreditCard className="text-gray-400" />
                        My Subscription
                      </Link>
                      {isFreePlan && (
                        <Link
                          href="/subscription"
                          className="flex items-center gap-2 px-4 py-2 text-white hover:bg-gray-700"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <FiZap className="text-purple-400" />
                          Upgrade Plan
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          signOut();
                          setIsProfileOpen(false);
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-white hover:bg-gray-700 w-full"
                      >
                        <FiLogOut className="text-gray-400" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex gap-4 items-center">
                <Link
                  href="/subscription"
                  className="text-white hover:text-gray-300"
                >
                  Pricing
                </Link>

                <Link
                  href="/login"
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-gray-800 border-t border-gray-700 py-4 px-4 shadow-lg z-50">
            <div className="flex flex-col gap-4">
              <Link
                href="/search"
                className="text-white hover:text-gray-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Search
              </Link>
              {loading ? (
                <div className="w-full h-[40px] bg-gray-700 animate-pulse rounded-lg"></div>
              ) : user ? (
                <>
                  <Link
                    href="/my-images"
                    className="text-white hover:text-gray-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Images
                  </Link>
                  <Link
                    href="/my-subscription"
                    className="flex items-center gap-2 text-white hover:text-gray-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiCreditCard className="text-gray-400" />
                    My Subscription
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg w-full"
                  >
                    <FiLogOut className="text-gray-400" />
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/subscription"
                    className="text-white hover:text-gray-300"
                  >
                    Pricing
                  </Link>
                  <Link
                    href="/login"
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
