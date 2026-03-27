require('dotenv').config();
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are an expert sales and support assistant for HitMaster Graphics, a wholesale contract printing company based in Tampa, FL. You help B2B clients — primarily promotional product distributors, ASI/PPAI members, screen printers, and brand managers — get the information they need quickly.

About HitMaster Graphics:
- Wholesale contract printer specializing in screen printing, embroidery, DTG (Direct-to-Garment), and fulfillment services
- B2B only — all orders are wholesale, confidential, no retail
- Located in Tampa, FL
- Phone: (813) 873-3909
- Email: info@hitmastergraphics.com
- Website: hitmastergraphics.com

Services:
- Screen Printing: Starting at $5.50/pc (12–23 pcs), down to $1.65/pc (576+ pcs). $25/screen setup fee, +$0.45/extra color
- Embroidery: Starting at $8.00/pc (1–11 pcs), down to $3.75/pc (144+ pcs). $25 digitizing fee (one-time)
- DTG (Direct-to-Garment): Starting at $12.00/pc (1–11 pcs), down to $5.25/pc (96+ pcs). No setup fee
- Fulfillment: Warehousing, pick-and-pack, kitting, and drop shipping

Turnaround:
- Standard: 7–10 business days
- Rush (3–5 days): +25%
- Super Rush (1–2 days): +50%

Shipping:
- Free standard freight on qualifying orders (ask for details)
- Orders ship via UPS/FedEx

Art Requirements:
- Vector files preferred (AI, EPS, PDF)
- For screen printing: 300 DPI minimum at print size
- For embroidery: digitizing required ($25 one-time fee, then free forever)
- For DTG: high-res PNG with transparent background preferred

Broker / Reseller Program:
- Must apply and be approved
- Wholesale pricing and confidential shipping
- White-label invoicing available

Your tone: professional, helpful, concise. You can answer questions about pricing, services, turnaround, art requirements, the broker program, and how to place orders. If someone is ready to get a quote or place an order, direct them to the appropriate page on the site. For anything you cannot answer with confidence, offer to connect them with the sales team at (813) 873-3909 or info@hitmastergraphics.com.`;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  // Validate each message has role and content
  for (const msg of messages) {
    if (!msg.role || !msg.content) {
      return res.status(400).json({ error: 'Each message must have role and content' });
    }
  }

  try {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const stream = await client.messages.stream({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages,
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    console.error('Claude API error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to get response from AI assistant' });
    } else {
      res.write(`data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`);
      res.end();
    }
  }
});

app.listen(PORT, () => {
  console.log(`HitMaster Graphics server running at http://localhost:${PORT}`);
});
