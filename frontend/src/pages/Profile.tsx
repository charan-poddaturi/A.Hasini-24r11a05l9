import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getProfile } from "../services/user";
import { api } from "../services/api";

export const Profile: React.FC = () => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProfile()
      .then(setProfile)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await api.put("/users/profile", profile);
    setSaving(false);
    alert("Profile saved");
  };

  if (loading) return <p>Loading profile...</p>;
  if (!profile) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">{t("pages.profile")}</h1>
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              className="mt-1 w-full border rounded px-3 py-2"
              value={profile.name || ""}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              className="mt-1 w-full border rounded px-3 py-2 bg-slate-100"
              value={profile.email || ""}
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input
              className="mt-1 w-full border rounded px-3 py-2"
              value={profile.phone || ""}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Blood Type</label>
            <input
              className="mt-1 w-full border rounded px-3 py-2"
              value={profile.bloodType || ""}
              onChange={(e) => setProfile({ ...profile, bloodType: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium">Medical Info</label>
            <textarea
              className="mt-1 w-full border rounded px-3 py-2"
              value={profile.medicalInfo || ""}
              onChange={(e) => setProfile({ ...profile, medicalInfo: e.target.value })}
            />
          </div>
        </div>
        <button
          className="mt-4 rounded bg-accent px-4 py-2 text-white hover:bg-blue-700"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};
