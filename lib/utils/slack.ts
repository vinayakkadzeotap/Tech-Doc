// Slack webhook notification helper
// Sends Block Kit formatted messages to a Slack channel

interface SlackBlock {
  type: string;
  text?: { type: string; text: string; emoji?: boolean };
  elements?: Array<{ type: string; text: string; emoji?: boolean }>;
  fields?: Array<{ type: string; text: string }>;
}

export async function sendSlackNotification(
  webhookUrl: string,
  title: string,
  body: string,
  link?: string
): Promise<boolean> {
  if (!webhookUrl) return false;

  const blocks: SlackBlock[] = [
    {
      type: 'header',
      text: { type: 'plain_text', text: title, emoji: true },
    },
    {
      type: 'section',
      text: { type: 'mrkdwn', text: body },
    },
  ];

  if (link) {
    blocks.push({
      type: 'context',
      elements: [{ type: 'mrkdwn', text: `<${link}|View in ZeoAI Learning>` }],
    });
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blocks }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
