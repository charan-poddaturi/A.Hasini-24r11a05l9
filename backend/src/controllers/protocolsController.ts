import { Request, Response } from "express";
import { Protocol } from "../models/Protocol";

export const listProtocols = async (req: Request, res: Response) => {
  const lang = (req.query.lang as string) || "en";
  const protocols = await Protocol.find();
  const results = protocols.map((p) => {
    const localized = p.languages?.[lang] || { title: p.title, steps: p.steps };
    return {
      key: p.key,
      title: localized.title,
      steps: localized.steps,
      tags: p.tags,
    };
  });
  res.json(results);
};
