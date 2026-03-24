import { config } from "../config";

import axios from "axios";

const hasTwilio = Boolean(
  config.twilio.accountSid && config.twilio.authToken && config.twilio.fromNumber
);

export const sendSms = async (to: string, message: string) => {
  if (!hasTwilio) {
    console.log("Twilio not configured, skipping SMS", { to, message });
    return;
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${config.twilio.accountSid}/Messages.json`;
  const payload = new URLSearchParams({
    To: to,
    From: config.twilio.fromNumber,
    Body: message,
  });

  try {
    await axios.post(url, payload.toString(), {
      auth: {
        username: config.twilio.accountSid,
        password: config.twilio.authToken,
      },
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    console.log("SMS sent", { to });
  } catch (error) {
    console.error("Failed to send SMS", error);
  }
};
