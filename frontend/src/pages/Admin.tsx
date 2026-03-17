import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../services/api";

type SOSAlert = {
  _id: string;
  userId: { name: string } | string;
  timestamp: string;
  location: { lat: number; lng: number };
  status: string;
};

export const Admin: React.FC = () => {
  const { t } = useTranslation();
  const [alerts, setAlerts] = useState<SOSAlert[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get<SOSAlert[]>("/sos/all")
      .then((res) => setAlerts(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">{t("pages.admin")}</h1>
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Recent SOS Alerts</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="space-y-3">
            {alerts.map((alert) => (
              <li key={alert._id} className="rounded border p-3">
                <p className="font-semibold">{(alert.userId as any).name || "Unknown"}</p>
                <p className="text-sm text-slate-600">Status: {alert.status}</p>
                <p className="text-sm text-slate-600">Time: {new Date(alert.timestamp).toLocaleString()}</p>
                <p className="text-sm text-slate-600">
                  Location: {alert.location.lat.toFixed(4)},{" "}
                  {alert.location.lng.toFixed(4)}
                </p>
                <a
                  className="text-sm text-accent hover:underline"
                  href={`https://www.google.com/maps/search/?api=1&query=${alert.location.lat},${alert.location.lng}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View on map
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
