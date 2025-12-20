import express from "express";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;
const VERIFY_TOKEN = "meu_webhook_pgi_2025";

app.use(bodyParser.json());

// =====================================================
// 🔐 VERIFICAÇÃO DO WEBHOOK
// =====================================================
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado com sucesso");
    return res.status(200).send(challenge);
  }

  console.log("❌ Falha na verificação do webhook");
  return res.sendStatus(403);
});

// =====================================================
// 📩 RECEBIMENTO DE EVENTOS (DEBUG TOTAL)
// =====================================================
app.post("/webhook", (req, res) => {
  console.log("📩 EVENTO BRUTO RECEBIDO:");
  console.log(JSON.stringify(req.body, null, 2));

  try {
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;

    if (!value?.messages) {
      console.log("ℹ️ Evento sem mensagens (status ou outro tipo)");
      return res.sendStatus(200);
    }

    const message = value.messages[0];
    const contact = value.contacts?.[0];

    const payloadCRM = {
      leadNome: contact?.profile?.name || "Sem nome",
      telefone: message.from,
      mensagem: message.text?.body || "",
      tipo: message.type,
      timestamp: Number(message.timestamp),
      messageId: message.id,
      phoneNumberId: value.metadata?.phone_number_id,
      recebidoEm: new Date().toISOString()
    };

    console.log("✅ PAYLOAD CRM NORMALIZADO:");
    console.log(JSON.stringify(payloadCRM, null, 2));

    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Erro ao processar webhook:", error);
    res.sendStatus(500);
  }
});

// =====================================================
// 🚀 START
// =====================================================
app.listen(PORT, () => {
  console.log(`🚀 Webhook rodando na porta ${PORT}`);
});
