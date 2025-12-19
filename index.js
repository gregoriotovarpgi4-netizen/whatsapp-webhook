/**
 * WhatsApp Cloud API Webhook
 * Porta: 3001
 * Ambiente: Local + Ngrok
 */

import express from "express";
import bodyParser from "body-parser";

const app = express();
const PORT = 3001;

// ⚠️ TROQUE PELO MESMO TOKEN CONFIGURADO NA META
const VERIFY_TOKEN = "meu_webhook_pgi_2025";

// Middleware
app.use(bodyParser.json());

// =====================================================
// 🔐 VERIFICAÇÃO DO WEBHOOK (META / FACEBOOK)
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
// 📩 RECEBIMENTO DE EVENTOS DO WHATSAPP
// =====================================================
app.post("/webhook", (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;

    // Ignora eventos que não sejam mensagens
    if (!value?.messages || !value?.contacts) {
      return res.sendStatus(200);
    }

    const message = value.messages[0];
    const contact = value.contacts[0];

    const payloadCRM = {
      leadNome: contact.profile?.name || "Sem nome",
      telefone: message.from,
      mensagem: message.text?.body || "",
      tipo: message.type,
      timestamp: Number(message.timestamp),
      messageId: message.id,
      phoneNumberId: value.metadata?.phone_number_id,
      recebidoEm: new Date().toISOString()
    };

    console.log("📥 Evento recebido do WhatsApp:");
    console.log(JSON.stringify(payloadCRM, null, 2));

    // 🔜 AQUI ENTRA:
    // - salvar no banco
    // - criar lead
    // - mover funil
    // - responder mensagem

    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Erro ao processar webhook:", error);
    res.sendStatus(500);
  }
});

// =====================================================
// 🚀 START SERVER
// =====================================================
app.listen(PORT, () => {
  console.log(`🚀 Webhook rodando na porta ${PORT}`);
});
