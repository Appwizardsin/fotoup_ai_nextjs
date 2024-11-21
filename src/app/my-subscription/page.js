'use client';

import { useState, useEffect } from "react";
import withAuth from "../components/withAuth";
import { users } from "@/services/api";

function MySubscriptionPage({ user }) {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await users.getSubscription();
        setSubscription(response.subscription);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load subscription details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  const handleCancelSubscription = async () => {
    if (!window.confirm("Are you sure you want to cancel your subscription?")) {
      return;
    }

    setCancelling(true);
    try {
      await users.cancelSubscription(subscription.paddleSubscriptionId);
      const response = await users.getSubscription();
      setSubscription(response.subscription);
    } catch (err) {
      setError("Failed to cancel subscription");
      console.error(err);
    } finally {
      setCancelling(false);
    }
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

  if (!subscription) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">No Active Subscription</h1>
          <p className="text-gray-400 mb-8">You don't have an active subscription.</p>
          <a
            href="/subscription"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            View Plans
          </a>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">My Subscription</h1>
        
        <div className="bg-gray-800 rounded-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {subscription.customData.planType.charAt(0).toUpperCase() + subscription.customData.planType.slice(1)} Plan
              </h2>
              <p className="text-gray-400">
                {subscription.billingCycle.interval}ly billing
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white mb-1">
                ${(parseInt(subscription.items[0].price.unitPrice.amount) / 100).toFixed(2)}
                <span className="text-gray-400 text-base font-normal">/{subscription.billingCycle.interval}</span>
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                subscription.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
              }`}>
                {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-gray-400 mb-2">Current Period</h3>
                <p className="text-white">
                  {formatDate(subscription.currentBillingPeriod.startsAt)} - {formatDate(subscription.currentBillingPeriod.endsAt)}
                </p>
              </div>
              {subscription.nextBilledAt && (
                <div>
                  <h3 className="text-gray-400 mb-2">Next Billing Date</h3>
                  <p className="text-white">{formatDate(subscription.nextBilledAt)}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-center">
          {subscription.requestedCancellation ? (
            <div>
              <p className="text-gray-400 mb-4">
                Your subscription will be cancelled at the end of the current billing period.
              </p>
              <p className="text-gray-400">
                Access will remain until: {formatDate(subscription.currentBillingPeriod.endsAt)}
              </p>
            </div>
          ) : (
            <>
              <button
                onClick={handleCancelSubscription}
                disabled={cancelling || subscription.status !== 'active'}
                className={`px-6 py-2 rounded-lg ${
                  cancelling || subscription.status !== 'active'
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                } text-white transition-colors`}
              >
                {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
              </button>
              {subscription.status !== 'active' && (
                <p className="text-gray-400 mt-2">
                  Your subscription is not active and cannot be cancelled.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default withAuth(MySubscriptionPage); 