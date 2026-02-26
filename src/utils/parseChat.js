/**
 * WhatsApp Chat Parser
 *
 * Parses exported WhatsApp .txt chat files into structured message objects.
 * Supports both 12h and 24h time formats, multiple date separators (/, -, .)
 * and multi-line messages.
 */

// Regex to match the start of a WhatsApp message line.
// Captures: date, time, ampm (optional), and the rest of the line.
// Examples it handles:
//   1/5/25, 10:30 AM - John: Hello
//   01/05/2025, 22:30 - John: Hello
//   [1/5/25, 10:30:00 AM] John: Hello
//   5.1.25, 10:30 - John: Hello
const MESSAGE_START_REGEX =
  /^\[?(\d{1,2}[/\-.]\d{1,2}[/\-.]\d{2,4}),?\s(\d{1,2}[:.]\d{2}(?:[:.]\d{2})?)\s?(AM|PM|am|pm)?\]?\s?[-–—]\s?(.*)/;

// Separates "Sender: message" from system messages (no colon-sender pattern)
const SENDER_MSG_REGEX = /^([^:]+?):\s([\s\S]*)/;

// Known system message patterns
const SYSTEM_PATTERNS = [
  /messages and calls are end-to-end encrypted/i,
  /changed the subject/i,
  /changed this group/i,
  /changed the group/i,
  /created group/i,
  /added\s/i,
  /removed\s/i,
  /left$/i,
  /joined using/i,
  /changed their phone number/i,
  /your security code.*changed/i,
  /disappeared/i,
  /message timer/i,
  /\<media omitted\>/i,
  /you were added/i,
  /waiting for this message/i,
];

/**
 * Checks if a message body (after date/time removal) is a system message.
 */
function isSystemMessage(body) {
  // No sender:message pattern → likely system
  if (!SENDER_MSG_REGEX.test(body)) return true;
  // Matches known system patterns
  return SYSTEM_PATTERNS.some((pattern) => pattern.test(body));
}

/**
 * Parses a raw WhatsApp exported chat string into an array of message objects.
 *
 * @param {string} rawText - The full text content of the exported .txt file.
 * @returns {{ messages: Array, participants: string[], chatName: string }}
 */
export function parseChat(rawText) {
  const lines = rawText.split("\n");
  const messages = [];
  let currentMessage = null;

  for (const line of lines) {
    const match = line.match(MESSAGE_START_REGEX);

    if (match) {
      // Flush previous message
      if (currentMessage) {
        messages.push(currentMessage);
      }

      const [, date, time, ampm, body] = match;
      const timeStr = ampm ? `${time} ${ampm.toUpperCase()}` : time;

      if (isSystemMessage(body)) {
        currentMessage = {
          id: messages.length,
          type: "system",
          sender: null,
          message: body.trim(),
          date,
          time: timeStr,
          isOwner: false,
        };
      } else {
        const senderMatch = body.match(SENDER_MSG_REGEX);
        if (senderMatch) {
          currentMessage = {
            id: messages.length,
            type: "message",
            sender: senderMatch[1].trim(),
            message: senderMatch[2].trim(),
            date,
            time: timeStr,
            isOwner: false, // will be set later
          };
        } else {
          // Fallback: treat as system
          currentMessage = {
            id: messages.length,
            type: "system",
            sender: null,
            message: body.trim(),
            date,
            time: timeStr,
            isOwner: false,
          };
        }
      }
    } else if (currentMessage) {
      // Continuation of a multi-line message
      currentMessage.message += "\n" + line;
    }
    // Ignore lines before any message starts
  }

  // Flush last message
  if (currentMessage) {
    messages.push(currentMessage);
  }

  // Detect participants
  const senderCounts = {};
  for (const msg of messages) {
    if (msg.type === "message" && msg.sender) {
      senderCounts[msg.sender] = (senderCounts[msg.sender] || 0) + 1;
    }
  }

  const participants = Object.keys(senderCounts);

  // Auto-detect owner: In WhatsApp exports, "You" is often used,
  // otherwise we pick the sender who sent the most messages as the exporter.
  let owner = null;
  if (senderCounts["You"]) {
    owner = "You";
  } else {
    // Most frequent sender is likely the exporter
    owner = participants.reduce(
      (a, b) => (senderCounts[a] >= senderCounts[b] ? a : b),
      participants[0],
    );
  }

  // Mark owner messages
  for (const msg of messages) {
    if (msg.type === "message" && msg.sender === owner) {
      msg.isOwner = true;
    }
  }

  // Reassign sequential IDs
  messages.forEach((msg, i) => {
    msg.id = i;
  });

  // Derive chat name
  const otherParticipants = participants.filter((p) => p !== owner);
  const chatName =
    otherParticipants.length === 1
      ? otherParticipants[0]
      : otherParticipants.length > 1
        ? `Group (${participants.length} participants)`
        : owner || "Chat";

  return {
    messages,
    participants,
    owner,
    chatName,
  };
}
