function clean(value) {
  return String(value || '')
    .replace(/[ \t]+/g, ' ')
    .replace(/(\r?\n){3,}/g, '\n\n')
    .trim();
}

function h(value) {
  return clean(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function field(payload, key) {
  const value = payload && payload[key];
  return Array.isArray(value) || value == null ? '' : clean(value);
}

function envValue(key) {
  return clean(process.env[key]).replace(/^['"]|['"]$/g, '');
}

module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ ok: false, error: 'Metodo nao permitido.' });
      return;
    }

    const botToken = envValue('TELEGRAM_BOT_TOKEN');
    const chatId = envValue('TELEGRAM_CHAT_ID');

    if (!botToken || !chatId) {
      console.error('Telegram env vars missing', {
        hasToken: Boolean(botToken),
        hasChatId: Boolean(chatId),
      });
      res.status(500).json({ ok: false, error: 'Telegram nao configurado.' });
      return;
    }

    let payload = {};
    try {
      payload = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    } catch (error) {
      console.error('Invalid JSON payload', error);
      res.status(400).json({ ok: false, error: 'JSON invalido.' });
      return;
    }

    if (payload.website) {
      res.status(200).json({ ok: true });
      return;
    }

    const name = field(payload, 'name');
    const phone = field(payload, 'phone');
    const relationshipTime = field(payload, 'relationship_time');
    const leadMessage = field(payload, 'message');
    const resultTitle = field(payload, 'result_title');
    const resultText = field(payload, 'result_text');

    if (!name || !phone || !relationshipTime || !leadMessage) {
      res.status(422).json({ ok: false, error: 'Preencha nome, telefone, tempo de relacionamento e mensagem.' });
      return;
    }

    const answers = payload.answers && typeof payload.answers === 'object' ? payload.answers : {};
    const answersText = Object.entries(answers)
      .filter(([question, answer]) => typeof question === 'string' && !Array.isArray(answer))
      .map(([question, answer]) => `\n<b>${h(question)}:</b> ${h(answer)}`)
      .join('');

    const utmLines = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
      .map((key) => {
        const value = field(payload, key);
        return value ? `\n<b>${h(key)}:</b> ${h(value)}` : '';
      })
      .join('');

    const forwardedFor = req.headers['x-forwarded-for'];
    const ip = Array.isArray(forwardedFor) ? forwardedFor[0] : String(forwardedFor || '').split(',')[0];

    let message = '<b>Novo lead do Quiz - Alianca Inquebravel</b>\n\n';
    message += `<b>Nome:</b> ${h(name)}\n`;
    message += `<b>Telefone/WhatsApp:</b> ${h(phone)}\n`;
    message += `<b>Tempo de relacionamento:</b> ${h(relationshipTime)}\n\n`;
    message += `<b>Mensagem do lead:</b>\n${h(leadMessage)}\n\n`;
    message += `<b>Resultado do quiz:</b> ${h(resultTitle)}\n`;
    message += `${h(resultText)}\n\n`;
    message += `<b>Respostas do questionario:</b>${answersText || '\nSem respostas registradas.'}\n\n`;
    message += '<b>Origem:</b>\n';
    message += `<b>Pagina:</b> ${h(field(payload, 'page_url'))}\n`;
    message += `<b>Referer:</b> ${h(field(payload, 'referrer') || 'Direto')}${utmLines}\n`;
    message += `<b>User agent:</b> ${h(field(payload, 'user_agent'))}\n`;
    message += `<b>IP:</b> ${h(ip)}\n`;
    message += `<b>Data:</b> ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`;

    const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    const telegramData = await telegramResponse.json().catch(() => null);

    if (!telegramResponse.ok || !telegramData || !telegramData.ok) {
      console.error('Telegram sendMessage failed', {
        status: telegramResponse.status,
        statusText: telegramResponse.statusText,
        telegramData,
        chatId,
      });
      res.status(502).json({
        ok: false,
        error: 'Telegram nao confirmou o envio. Verifique token, chat ID e permissao do bot.',
      });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Unexpected lead API error', error);
    res.status(500).json({ ok: false, error: 'Erro interno ao enviar lead.' });
  }
};
