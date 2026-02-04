"use client";

import { useEffect, useState } from "react";

interface PaymentGateway {
  enabled: boolean;
  mode: "test" | "live";
  publicKey: string;
  secretKey: string;
}

interface PaymentGateways {
  stripe: PaymentGateway;
  paypal: PaymentGateway;
  afterpay: PaymentGateway;
}

const defaultGateways: PaymentGateways = {
  stripe: { enabled: false, mode: "test", publicKey: "", secretKey: "" },
  paypal: { enabled: false, mode: "test", publicKey: "", secretKey: "" },
  afterpay: { enabled: false, mode: "test", publicKey: "", secretKey: "" },
};

export default function AdminSettings() {
  const [globalDiscount, setGlobalDiscount] = useState("0");
  const [pointsRate, setPointsRate] = useState("0.01");
  const [gateways, setGateways] = useState<PaymentGateways>(defaultGateways);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPayment, setSavingPayment] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.global_discount_percent !== undefined) {
          setGlobalDiscount(data.global_discount_percent.toString());
        }
        if (data.points_per_dollar_spent !== undefined) {
          setPointsRate(data.points_per_dollar_spent.toString());
        }
        if (data.payment_gateways) {
          setGateways({ ...defaultGateways, ...data.payment_gateways });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          globalDiscountPercent: parseFloat(globalDiscount) || 0,
          pointsPerDollarSpent: parseFloat(pointsRate) || 0.01,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch {
      // Ignore
    } finally {
      setSaving(false);
    }
  }

  async function handleSavePayment(e: React.FormEvent) {
    e.preventDefault();
    setSavingPayment(true);
    setPaymentSuccess(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentGateways: gateways }),
      });

      if (res.ok) {
        setPaymentSuccess(true);
        setTimeout(() => setPaymentSuccess(false), 3000);
      }
    } catch {
      // Ignore
    } finally {
      setSavingPayment(false);
    }
  }

  function updateGateway(
    name: keyof PaymentGateways,
    field: keyof PaymentGateway,
    value: string | boolean
  ) {
    setGateways((prev) => ({
      ...prev,
      [name]: { ...prev[name], [field]: value },
    }));
  }

  function toggleSecret(key: string) {
    setShowSecrets((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        <div className="animate-pulse h-48 rounded-xl border border-white/10 bg-[#0a0a0a]" />
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-[#111] px-4 py-2.5 text-white placeholder-gray-600 focus:border-[#e8751a] focus:outline-none";

  const gatewayConfigs: {
    key: keyof PaymentGateways;
    label: string;
    icon: string;
    publicLabel: string;
    secretLabel: string;
  }[] = [
    {
      key: "stripe",
      label: "Stripe",
      icon: "💳",
      publicLabel: "Publishable Key",
      secretLabel: "Secret Key",
    },
    {
      key: "paypal",
      label: "PayPal",
      icon: "🅿️",
      publicLabel: "Client ID",
      secretLabel: "Client Secret",
    },
    {
      key: "afterpay",
      label: "Afterpay / Zip",
      icon: "🏷️",
      publicLabel: "Merchant ID",
      secretLabel: "Secret Key",
    },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold mb-6">Global Settings</h1>

        {success && (
          <div className="mb-4 rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-400">
            Settings saved successfully.
          </div>
        )}

        <form
          onSubmit={handleSave}
          className="max-w-xl rounded-xl border border-white/10 bg-[#0a0a0a] p-6 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Global Discount (%)
            </label>
            <input
              type="number"
              value={globalDiscount}
              onChange={(e) => setGlobalDiscount(e.target.value)}
              min="0"
              max="100"
              step="0.01"
              className="w-full max-w-[200px] rounded-lg border border-white/10 bg-[#111] px-4 py-2.5 text-white focus:border-[#e8751a] focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              Applies to all members. If a member has a higher personal discount,
              their discount is used instead.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Points per Dollar Spent
            </label>
            <input
              type="number"
              value={pointsRate}
              onChange={(e) => setPointsRate(e.target.value)}
              min="0"
              step="0.001"
              className="w-full max-w-[200px] rounded-lg border border-white/10 bg-[#111] px-4 py-2.5 text-white focus:border-[#e8751a] focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              Default: 0.01 (1 point per $100 spent). Points are awarded when
              orders are marked as delivered.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[#e8751a] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#d06815] disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </form>
      </div>

      {/* Payment Gateway Configuration */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Payment Gateways</h2>
        <p className="text-sm text-gray-400 mb-6">
          Configure payment methods for member checkout. Enable one or more
          gateways and enter your API credentials.
        </p>

        {paymentSuccess && (
          <div className="mb-4 rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-400">
            Payment settings saved successfully.
          </div>
        )}

        <form onSubmit={handleSavePayment} className="space-y-4">
          {gatewayConfigs.map((gw) => {
            const config = gateways[gw.key];
            return (
              <div
                key={gw.key}
                className={`rounded-xl border p-6 transition-colors ${
                  config.enabled
                    ? "border-[#e8751a]/30 bg-[#0a0a0a]"
                    : "border-white/10 bg-[#0a0a0a]"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{gw.icon}</span>
                    <div>
                      <h3 className="text-base font-semibold text-white">
                        {gw.label}
                      </h3>
                      <span
                        className={`text-xs ${
                          config.enabled ? "text-green-400" : "text-gray-500"
                        }`}
                      >
                        {config.enabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      updateGateway(gw.key, "enabled", !config.enabled)
                    }
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      config.enabled ? "bg-[#e8751a]" : "bg-gray-600"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                        config.enabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {config.enabled && (
                  <div className="space-y-4 border-t border-white/10 pt-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">
                        Mode
                      </label>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            updateGateway(gw.key, "mode", "test")
                          }
                          className={`rounded-lg px-4 py-2 text-xs font-medium transition-colors ${
                            config.mode === "test"
                              ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                              : "bg-[#111] text-gray-400 border border-white/10 hover:border-white/20"
                          }`}
                        >
                          Test Mode
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            updateGateway(gw.key, "mode", "live")
                          }
                          className={`rounded-lg px-4 py-2 text-xs font-medium transition-colors ${
                            config.mode === "live"
                              ? "bg-green-500/10 text-green-400 border border-green-500/20"
                              : "bg-[#111] text-gray-400 border border-white/10 hover:border-white/20"
                          }`}
                        >
                          Live Mode
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">
                          {gw.publicLabel}
                        </label>
                        <input
                          type="text"
                          value={config.publicKey}
                          onChange={(e) =>
                            updateGateway(gw.key, "publicKey", e.target.value)
                          }
                          placeholder={`Enter ${gw.publicLabel.toLowerCase()}...`}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">
                          {gw.secretLabel}
                        </label>
                        <div className="relative">
                          <input
                            type={
                              showSecrets[gw.key] ? "text" : "password"
                            }
                            value={config.secretKey}
                            onChange={(e) =>
                              updateGateway(
                                gw.key,
                                "secretKey",
                                e.target.value
                              )
                            }
                            placeholder={`Enter ${gw.secretLabel.toLowerCase()}...`}
                            className={inputClass}
                          />
                          <button
                            type="button"
                            onClick={() => toggleSecret(gw.key)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                          >
                            {showSecrets[gw.key] ? (
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {config.mode === "test" && (
                      <p className="text-xs text-yellow-400/60">
                        Running in test mode — no real payments will be
                        processed.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          <button
            type="submit"
            disabled={savingPayment}
            className="rounded-lg bg-[#e8751a] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#d06815] disabled:opacity-50"
          >
            {savingPayment ? "Saving..." : "Save Payment Settings"}
          </button>
        </form>
      </div>
    </div>
  );
}
