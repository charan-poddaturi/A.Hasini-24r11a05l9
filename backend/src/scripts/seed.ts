import { connectDb } from "../db";
import { PublicEmergencyNumber } from "../models/PublicEmergencyNumber";
import { Protocol } from "../models/Protocol";

const seedPublicNumbers = async () => {
  const defaults = [
    {
      country: "india",
      police: "100",
      ambulance: "102",
      fire: "101",
    },
    {
      country: "united states",
      police: "911",
      ambulance: "911",
      fire: "911",
    },
  ];

  for (const item of defaults) {
    await PublicEmergencyNumber.updateOne({ country: item.country }, item, { upsert: true });
  }
};

const seedProtocols = async () => {
  const defaults = [
    {
      key: "cpr",
      title: "CPR (Cardiopulmonary Resuscitation)",
      tags: ["medical", "first_aid"],
      steps: [
        { title: "Check responsiveness", description: "Tap the person and shout, 'Are you okay?'" },
        { title: "Call for help", description: "Ask someone to call emergency services immediately." },
        { title: "Start chest compressions", description: "Place hands on center of chest and push hard and fast." },
      ],
      languages: {
        en: {
          title: "CPR (Cardiopulmonary Resuscitation)",
          steps: [
            { title: "Check responsiveness", description: "Tap the person and shout, 'Are you okay?'" },
            { title: "Call for help", description: "Ask someone to call emergency services immediately." },
            { title: "Start compressions", description: "Place hands on the center of the chest and push hard and fast." },
          ],
        },
        hi: {
          title: "सीपीआर (कार्डियोपल्मोनरी रिससिटेशन)",
          steps: [
            { title: "प्रतिक्रिया जांचें", description: "व्यक्ति को हल्का थपथपाएँ और चिल्लाएँ, 'क्या आप ठीक हैं?'" },
            { title: "मदद के लिए कॉल करें", description: "किसी से तुरंत आपातकालीन सेवाओं को कॉल करने के लिए कहें।" },
            { title: "दबाव देना शुरू करें", description: "छाती के बीच में हाथ रखें और ज़ोर से और तेज़ी से दबाएँ।" },
          ],
        },
      },
    },
  ];

  for (const item of defaults) {
    await Protocol.updateOne({ key: item.key }, item, { upsert: true });
  }
};

const run = async () => {
  await connectDb();
  await seedPublicNumbers();
  await seedProtocols();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
