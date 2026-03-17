import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../services/api";

type Protocol = {
  key: string;
  title: string;
  steps: Array<{ title: string; description: string }>;
};

export const Protocols: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await api.get<Protocol[]>("/protocols", {
        params: { lang: i18n.language },
      });
      setProtocols(res.data);
      setLoading(false);
    };
    load();
  }, [i18n.language]);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">{t("pages.protocols")}</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {protocols.map((protocol) => (
            <div key={protocol.key} className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-3">{protocol.title}</h2>
              <ol className="space-y-2">
                {protocol.steps.map((step, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="font-semibold">{idx + 1}.</span>
                    <div>
                      <p className="font-semibold">{step.title}</p>
                      <p className="text-sm text-slate-600">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
