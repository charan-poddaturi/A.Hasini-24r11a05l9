import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export const SOSButton: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSOS = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await api.post("/sos/trigger", {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          alert(t("sos.sent"));
        } catch (err) {
          console.error(err);
          alert("Failed to send SOS");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error(error);
        alert("Could not determine location");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  return (
    <button
      disabled={loading || !user}
      className="w-full max-w-sm mx-auto rounded-full bg-danger px-6 py-4 text-white text-xl font-semibold shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-50"
      onClick={handleSOS}
      aria-label="SOS"
    >
      {loading ? t("sos.sending") : t("sos.trigger")}
    </button>
  );
};
