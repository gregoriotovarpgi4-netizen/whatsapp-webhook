import express from "express";

const app = express();
app.use(express.json());

// 🔐 token que você vai usar na Meta
const VERIFY_TOKEN = "EAAQ2VxGn1QcBQJggDXxPv6D0n6XeyZCwJxZBdE6NGvg2pQBriFoSPybP2a79KVlse6VUuENvBZCZAPXEMEqidqHlk7WHLLzE3Id6qLumWelbrDGnMqbcuZAZCD6NjgEGKsPr4YRtYZBVcKUq1tpe3wnyZBWQSH2kes6ZAOkDvJ7RZABlOb5HeX030kI8YgFpyituRJtkDQOBpWWTuZAIKCB9vRlhBmO0Jz7Xqd88zakx5PGWd49WoUNUZA6AyRwlJYBB8itG9XS0MKomBuqG20T0r75fyyyX";

// 🔹 Rota de verificação (OBRIGATÓRIA)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado com sucesso");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

// 🔹 Rota que recebe mensagens
app.post("/webhook", (req, res) => {
  console.log("📩 Evento recebido:");
  console.dir(req.body, { depth: null });

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Webhook rodando na porta ${PORT}`);
});

