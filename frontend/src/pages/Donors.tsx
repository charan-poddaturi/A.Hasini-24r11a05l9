import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

type Donor = {
  _id: string;
  name: string;
  bloodType?: string;
  address?: { city?: string; state?: string; country?: string };
  phone?: string;
  donorDetails?: { isAvailable: boolean; verifiedByAdmin: boolean };
};

export const Donors: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [donors, setDonors] = useState<Donor[]>([]);
  const [search, setSearch] = useState({ bloodType: "", city: "" });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (search.bloodType) params.bloodType = search.bloodType;
      if (search.city) params.city = search.city;
      const res = await api.get<Donor[]>("/donors/search", { params });
      setDonors(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const requestDonor = async (donorId: string, bloodType?: string) => {
    await api.post("/donors/request", { donorId, bloodType });
    alert("Request sent");
  };

  const registerAsDonor = async () => {
    await api.post("/donors/register", { bloodType: "O+", isAvailable: true });
    alert("You are now registered as a donor");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{t("pages.donors")}</h1>
        {user && (
          <button
            className="rounded bg-accent px-4 py-2 text-white hover:bg-blue-700"
            onClick={registerAsDonor}
          >
            Register as Donor
          </button>
        )}
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="font-semibold mb-3">Search Donors</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <input
            className="border rounded px-3 py-2"
            placeholder="Blood Type"
            value={search.bloodType}
            onChange={(e) => setSearch({ ...search, bloodType: e.target.value })}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="City"
            value={search.city}
            onChange={(e) => setSearch({ ...search, city: e.target.value })}
          />
          <button
            className="rounded bg-accent px-4 py-2 text-white hover:bg-blue-700"
            onClick={load}
          >
            Search
          </button>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="font-semibold mb-3">Results</h2>
        {loading ? (
          <p>Searching...</p>
        ) : donors.length === 0 ? (
          <p className="text-sm text-slate-600">No donors found.</p>
        ) : (
          <ul className="space-y-3">
            {donors.map((donor) => (
              <li key={donor._id} className="flex flex-col gap-2 rounded border p-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">{donor.name}</p>
                  <p className="text-sm text-slate-600">
                    {donor.bloodType} • {donor.address?.city}, {donor.address?.state}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="rounded bg-accent px-3 py-2 text-white hover:bg-blue-700"
                    onClick={() => requestDonor(donor._id, donor.bloodType)}
                  >
                    Request
                  </button>
                  {donor.phone && (
                    <a
                      className="text-sm text-accent hover:underline"
                      href={`tel:${donor.phone}`}
                    >
                      Call
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
