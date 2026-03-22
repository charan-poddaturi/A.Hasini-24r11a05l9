import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

type SOSAlertData = {
  alertId: string;
  user: { id: string; name: string; phone?: string };
  location: { lat: number; lng: number };
  timestamp: string;
};

type DonorRequestData = {
  requesterId: string;
  donorId: string;
  bloodType: string;
  message?: string;
};

export const GlobalAlerts: React.FC = () => {
  const { socket } = useAuth();
  const [sosAlert, setSosAlert] = useState<SOSAlertData | null>(null);
  const [donorRequest, setDonorRequest] = useState<DonorRequestData | null>(null);

  useEffect(() => {
    if (!socket) return;

    const handleSosTriggered = (data: SOSAlertData) => {
      setSosAlert(data);
    };

    const handleDonorRequest = (data: DonorRequestData) => {
      setDonorRequest(data);
    };

    socket.on("sos:triggered", handleSosTriggered);
    socket.on("donor:request", handleDonorRequest);

    return () => {
      socket.off("sos:triggered", handleSosTriggered);
      socket.off("donor:request", handleDonorRequest);
    };
  }, [socket]);

  return (
    <>
      {sosAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-red-600 p-6 text-white shadow-xl animate-pulse">
            <h2 className="text-2xl font-bold mb-4">🚨 EMERGENCY SOS 🚨</h2>
            <p className="text-lg mb-2">
              <strong>{sosAlert.user.name}</strong> triggered an SOS alert!
            </p>
            {sosAlert.user.phone && <p className="mb-4">Phone: {sosAlert.user.phone}</p>}
            
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${sosAlert.location.lat},${sosAlert.location.lng}`}
              target="_blank"
              rel="noreferrer"
              className="mb-4 block w-full rounded bg-white py-3 text-center font-semibold text-red-600 hover:bg-red-50"
            >
              View Location on Google Maps
            </a>
            
            <button
              onClick={() => setSosAlert(null)}
              className="mt-2 w-full rounded border border-white py-2 font-medium hover:bg-red-700"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {donorRequest && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg border-l-4 border-accent bg-white p-4 shadow-lg">
          <div className="flex items-start justify-between">
            <h3 className="font-bold text-slate-800">Blood Donor Request</h3>
            <button
              onClick={() => setDonorRequest(null)}
              className="text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>
          <p className="mt-2 text-sm text-slate-600">
            Someone requires <strong>{donorRequest.bloodType}</strong> blood.
            {donorRequest.message && <span className="block italic mt-1">"{donorRequest.message}"</span>}
          </p>
        </div>
      )}
    </>
  );
};
