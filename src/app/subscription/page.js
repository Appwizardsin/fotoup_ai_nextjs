"use client";

import { useState, useEffect } from "react";
import { FaCoins, FaCheck } from "react-icons/fa";
import { users, plans as plansApi } from "@/services/api";
import ProcessingModal from "../components/ProcessingModal";
import AuthForm from "../components/AuthForm";
import AuthModal from "../components/AuthModal";
import { useAuth } from "../context/AuthContext";

export default function SubscriptionPage() {
  const { user } = useAuth(null);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingPlan, setPendingPlan] = useState(null);
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [plans, setPlans] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const plansResponse = await plansApi.getAll();
      // Ensure plans is an array
      const plansArray = Array.isArray(plansResponse)
        ? plansResponse
        : plansResponse.data
        ? plansResponse.data
        : plansResponse.plans
        ? plansResponse.plans
        : [];

      // Add default values for missing properties
      const processedPlans = plansArray.map((plan) => ({
        id: plan.id || "",
        name: plan.name || "",
        credits: plan.credits || 0,
        monthlyPrice: plan.monthlyPrice || 0,
        yearlyPrice: plan.yearlyPrice || 0,
        features: plan.features || [],
        recommended: plan.recommended || false,
        currentPlan: plan.currentPlan || false,
        upgrade: plan.upgrade || false,
        downgrade: plan.downgrade || false,
        paddlePlanId: plan.paddlePlanId || { monthly: "", yearly: "" },
        buttonText: plan.buttonText || "",
      }));

      setPlans(processedPlans);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubscribe = async (plan) => {
    if (!user) {
      setShowAuthModal(true);
      setPendingPlan(plan);
      return;
    }

    if (plan.upgrade || plan.downgrade) {
      const action = plan.upgrade ? "upgrade" : "downgrade";
      const confirmed = window.confirm(
        `Are you sure you want to ${action} to ${plan.name} plan?`
      );

      if (confirmed) {
        try {
          setLoading(true);
          if (plan.upgrade) {
            await users.upgradePlan(plan.id, billingCycle);
          } else {
            await users.downgradePlan(plan.id, billingCycle);
          }
          const plansResponse = await plansApi.getAll();
          setPlans(plansResponse);
          alert(`Successfully ${action}d to ${plan.name} plan`);
        } catch (err) {
          console.error(err);
          const errorMessage =
            err.response?.data?.error + ", please contact support" ||
            err.response?.data?.message ||
            `Failed to ${action} subscription, please contact support`;
          alert(errorMessage);
        } finally {
          setLoading(false);
        }
      }
      return;
    }

    const planId = plan.paddlePlanId?.[billingCycle];

    if (!planId) {
      setError("Invalid plan selected");
      return;
    }

    Paddle.Checkout.open({
      settings: {
        theme: "dark",
        locale: "en",
        displayMode: "overlay",
        allowDiscountRemoval: true,
        showAddDiscounts: true,
        allowLogout: false,
      },
      items: [
        {
          priceId: planId,
          quantity: 1,
        },
      ],
      customer: {
        email: user.email,
      },
      customData: {
        userId: user.id,
        planType: plan.id,
        billingCycle: billingCycle,
      },
    });
  };

  const getButtonConfig = (plan) => {
    if (!user) {
      return {
        text: plan.buttonText || "Get Started",
        disabled: false,
        className: "bg-blue-600 hover:bg-blue-700 text-white",
        onClick: () => {
          setShowAuthModal(true);
          setPendingPlan(plan);
        },
      };
    }

    if (plan.currentPlan) {
      return {
        text: "Current Plan",
        disabled: true,
        className: "bg-green-600 text-white cursor-not-allowed",
      };
    }

    if (plan.id === "free" && !plan.currentPlan) {
      return {
        text: "Free",
        disabled: false,
        className: "bg-gray-600 hover:bg-gray-700 cursor-not-allowed",
      };
    }

    return {
      text:
        plan.buttonText ||
        (plan.upgrade
          ? `Upgrade to ${plan.name}`
          : `Downgrade to ${plan.name}`),
      disabled: false,
      className: `${
        !user.hasSubscription
          ? "bg-blue-600 hover:bg-blue-700"
          : plan.upgrade
          ? "bg-blue-600 hover:bg-blue-700"
          : "bg-gray-600 hover:bg-blue-700"
      } text-white`,
      onClick: () => handleSubscribe(plan),
    };
  };

  const handleSubscriptionSuccess = async (data) => {
    setLoading(true);
    setShowProcessingModal(true);
    try {
      Paddle.Checkout.close();
      await new Promise((resolve) => setTimeout(resolve, 5000));
      window.location.href = "/";
    } catch (err) {
      setError("Failed to activate subscription");
      console.error(err);
    } finally {
      setLoading(false);
      setShowProcessingModal(false);
    }
  };

  useEffect(() => {
    const paddleScript = document.createElement("script");
    paddleScript.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    paddleScript.type = "text/javascript";
    document.body.appendChild(paddleScript);

    paddleScript.onload = () => {
      Paddle.Environment.set("sandbox");
      Paddle.Initialize({
        token: "test_fb3d56d331eee802072a7625fb3",
        eventCallback: function (data) {
          if (data.name === "checkout.completed") {
            handleSubscriptionSuccess(data);
          }
        },
      });
    };
  }, []);

  const getPlanPrice = (plan) => {
    return billingCycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            {user ? "Choose Your Plan" : "Simple, Transparent Pricing"}
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {user
              ? "Select the perfect plan for your needs. Upgrade or downgrade at any time."
              : "Start for free, upgrade when you need more. No hidden fees."}
          </p>

          {/* Billing Cycle Toggle */}
          <div className="mt-8 inline-flex items-center bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-md transition-colors ${
                billingCycle === "monthly"
                  ? "bg-blue-600 text-white"
                  : "text-gray-400"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-2 rounded-md transition-colors ${
                billingCycle === "yearly"
                  ? "bg-blue-600 text-white"
                  : "text-gray-400"
              }`}
            >
              Yearly
              <span className="ml-1 text-xs text-green-400">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {Array.isArray(plans) &&
            plans.map((plan) => {
              const buttonConfig = getButtonConfig(plan);
              const price = getPlanPrice(plan);

              return (
                <div
                  key={plan.id}
                  className={`relative bg-gray-800 rounded-xl p-8 ${
                    plan.recommended
                      ? "border-2 border-blue-500 shadow-lg"
                      : "border border-gray-700"
                  }`}
                >
                  {plan.recommended && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm">
                        Recommended
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {plan.name}
                    </h3>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <FaCoins className="text-yellow-400 w-5 h-5" />
                      <span className="text-2xl font-bold text-white">
                        {plan.credits}
                      </span>
                      <span className="text-gray-400">credits/month</span>
                    </div>
                    <div className="text-3xl font-bold text-white">
                      ${price.toFixed(2)}
                      <span className="text-gray-400 text-base font-normal">
                        /{billingCycle === "yearly" ? "year" : "month"}
                      </span>
                    </div>
                    {billingCycle === "yearly" && plan.yearlyPrice > 0 && (
                      <div className="text-sm text-green-400 mt-1">
                        Save $
                        {(plan.monthlyPrice * 12 - plan.yearlyPrice).toFixed(2)}{" "}
                        a year
                      </div>
                    )}
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-gray-300"
                      >
                        <FaCheck className="text-green-400 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={buttonConfig.onClick}
                    disabled={buttonConfig.disabled}
                    className={`w-full py-2 px-4 rounded-lg transition-colors ${buttonConfig.className}`}
                  >
                    {buttonConfig.text}
                  </button>
                </div>
              );
            })}
        </div>

        {error && <div className="text-center mt-8 text-red-500">{error}</div>}
      </div>

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      )}
      <ProcessingModal isOpen={showProcessingModal} />
    </>
  );
}
