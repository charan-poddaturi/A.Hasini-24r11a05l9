import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getProfile, addContact, updateContact, deleteContact, EmergencyContact } from "../services/user";

export const Contacts: React.FC = () => {
  const { t } = useTranslation();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", relation: "", phone: "" });

  const load = async () => {
    setLoading(true);
    try {
      const profile = await getProfile();
      setContacts(profile.emergencyContacts ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async () => {
    if (!newContact.name || !newContact.relation || !newContact.phone) return;
    const added = await addContact(newContact);
    setContacts((prev) => [...prev, added]);
    setNewContact({ name: "", relation: "", phone: "" });
  };

  const handleDelete = async (id: string) => {
    await deleteContact(id);
    setContacts((prev) => prev.filter((c) => c._id !== id));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">{t("pages.contacts")}</h1>
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Quick Access</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="space-y-3">
            {contacts.map((contact) => (
              <li
                key={contact._id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div>
                  <p className="font-semibold">{contact.name}</p>
                  <p className="text-sm text-slate-600">
                    {contact.relation} • {contact.phone}
                  </p>
                </div>
                <button
                  className="text-sm text-red-600 hover:underline"
                  onClick={() => handleDelete(contact._id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Add Emergency Contact</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <input
            className="border rounded px-3 py-2"
            placeholder="Name"
            value={newContact.name}
            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Relation"
            value={newContact.relation}
            onChange={(e) => setNewContact({ ...newContact, relation: e.target.value })}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Phone"
            value={newContact.phone}
            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
          />
        </div>
        <button
          className="mt-4 rounded bg-accent px-4 py-2 text-white hover:bg-blue-700"
          onClick={handleAdd}
        >
          Add
        </button>
      </div>
    </div>
  );
};
