const crypto = require('node:crypto');

const MAX_LINE_LENGTH = 4096;
const INCOMING_DAMAGE_COLOR = '0xffcc0000';
const OUTGOING_DAMAGE_COLOR = '0xff00ffff';
const HIT_QUALITIES = ['Glances Off', 'Grazes', 'Hits', 'Penetrates', 'Smashes', 'Wrecks'];

const LOG_ENVELOPE_PATTERN =
  /^\[\s*(?<date>\d{4}\.\d{2}\.\d{2})\s+(?<time>\d{2}:\d{2}:\d{2})\s*\]\s+\((?<channel>[^)]*)\)\s*(?<message>.*)$/;
const JUMP_FROM_PATTERN = /^Jumping from (?<fromSystemName>.+?) to (?<systemName>.+)$/i;
const JUMP_TO_PATTERN = /^Jumping to (?<systemName>.+)$/i;
const COLOR_DAMAGE_PATTERN =
  /<color=(?<rawColor>0x[0-9a-f]+)><b>(?<amount>[\d,]+)<\/b>[\s\S]*?<font size=10>(?<relation>from|to)<\/font>\s*<b><color=0xffffffff>(?<label>[\s\S]*?)<\/b>[\s\S]*?\s-\s(?<tail>[^<>]+)$/i;
const INCOMING_MISS_PATTERN = /^(?<sourceLabel>.+?) misses you completely(?:\s-\s(?<weaponLabel>.+))?$/i;
const OUTGOING_MISS_PATTERN = /^Your(?: group of)? (?<sourceWeapon>.+?) misses (?<targetLabel>.+?) completely(?:\s-\s(?<weaponLabel>.+))?$/i;
const LEGACY_INCOMING_DAMAGE_PATTERNS = [
  /^(?<sourceLabel>.+?) hits you for (?<amount>\d+) (?<damageType>\w+) damage$/i,
  /^(?<sourceLabel>.+?) lightly hits you, doing (?<amount>\d+) (?<damageType>\w+) damage$/i
];

function parseEveLogLine(line, options = {}) {
  const cleanLine = cleanRawLine(line);
  if (!cleanLine || cleanLine.length > MAX_LINE_LENGTH) {
    return null;
  }

  const envelope = parseEnvelope(cleanLine);
  if (!envelope) {
    return null;
  }

  const observedAt = options.observedAt || new Date().toISOString();
  const base = {
    observedAt,
    eventTime: envelope.eventTime,
    channel: envelope.channel,
    rawLineHash: sha256(cleanLine)
  };

  const navigation = parseNavigation(envelope.message, base);
  if (navigation) {
    return withId(navigation);
  }

  if (envelope.channel.toLowerCase() !== 'combat') {
    return null;
  }

  const damage = parseColorDamage(envelope.message, base) || parseLegacyIncomingDamage(envelope.message, base);
  if (damage) {
    return withId(damage);
  }

  const miss = parseMiss(envelope.message, base);
  if (miss) {
    return withId(miss);
  }

  return null;
}

function parseEnvelope(line) {
  const match = line.match(LOG_ENVELOPE_PATTERN);
  if (!match?.groups) {
    return null;
  }

  const eventTime = parseEveTimestamp(match.groups.date, match.groups.time);
  if (!eventTime) {
    return null;
  }

  return {
    eventTime,
    channel: match.groups.channel.trim(),
    message: match.groups.message.trim()
  };
}

function parseNavigation(message, base) {
  const fromMatch = message.match(JUMP_FROM_PATTERN);
  if (fromMatch?.groups) {
    return {
      ...base,
      kind: 'navigation.jump',
      fromSystemName: fromMatch.groups.fromSystemName.trim(),
      systemName: fromMatch.groups.systemName.trim()
    };
  }

  const toMatch = message.match(JUMP_TO_PATTERN);
  if (toMatch?.groups) {
    return {
      ...base,
      kind: 'navigation.jump',
      fromSystemName: null,
      systemName: toMatch.groups.systemName.trim()
    };
  }

  return null;
}

function parseColorDamage(message, base) {
  const match = message.match(COLOR_DAMAGE_PATTERN);
  if (!match?.groups) {
    return null;
  }

  const rawColor = match.groups.rawColor.toLowerCase();
  const direction = directionFromColor(rawColor) || directionFromRelation(match.groups.relation);
  if (!direction) {
    return null;
  }

  const tailParts = match.groups.tail.split(/\s-\s/).map((part) => part.trim()).filter(Boolean);
  const hitQuality = tailParts.find((part) => HIT_QUALITIES.includes(part));
  if (!hitQuality) {
    return null;
  }

  const weaponParts = tailParts.slice(0, tailParts.indexOf(hitQuality));
  const observedLabel = cleanLabel(match.groups.label);
  return {
    ...base,
    kind: 'combat.damage',
    direction,
    amount: Number(match.groups.amount.replace(/,/g, '')),
    sourceLabel: direction === 'incoming' ? observedLabel : 'you',
    targetLabel: direction === 'incoming' ? 'you' : observedLabel,
    weaponLabel: weaponParts.length ? weaponParts.join(' - ') : null,
    hitQuality,
    rawColor
  };
}

function parseLegacyIncomingDamage(message, base) {
  for (const pattern of LEGACY_INCOMING_DAMAGE_PATTERNS) {
    const match = message.match(pattern);
    if (match?.groups) {
      return {
        ...base,
        kind: 'combat.damage',
        direction: 'incoming',
        amount: Number(match.groups.amount),
        sourceLabel: match.groups.sourceLabel.trim(),
        targetLabel: 'you',
        weaponLabel: null,
        hitQuality: null,
        damageType: match.groups.damageType,
        rawColor: null
      };
    }
  }

  return null;
}

function parseMiss(message, base) {
  const incoming = message.match(INCOMING_MISS_PATTERN);
  if (incoming?.groups) {
    return {
      ...base,
      kind: 'combat.miss',
      direction: 'incoming',
      sourceLabel: incoming.groups.sourceLabel.trim(),
      targetLabel: 'you',
      weaponLabel: incoming.groups.weaponLabel?.trim() || null
    };
  }

  const outgoing = message.match(OUTGOING_MISS_PATTERN);
  if (outgoing?.groups) {
    return {
      ...base,
      kind: 'combat.miss',
      direction: 'outgoing',
      sourceLabel: 'you',
      targetLabel: outgoing.groups.targetLabel.trim(),
      weaponLabel: outgoing.groups.weaponLabel?.trim() || outgoing.groups.sourceWeapon.trim()
    };
  }

  return null;
}

function directionFromColor(rawColor) {
  if (rawColor === INCOMING_DAMAGE_COLOR) {
    return 'incoming';
  }
  if (rawColor === OUTGOING_DAMAGE_COLOR) {
    return 'outgoing';
  }
  return null;
}

function directionFromRelation(relation) {
  if (String(relation).toLowerCase() === 'from') {
    return 'incoming';
  }
  if (String(relation).toLowerCase() === 'to') {
    return 'outgoing';
  }
  return null;
}

function parseEveTimestamp(date, time) {
  const [year, month, day] = date.split('.').map(Number);
  const [hour, minute, second] = time.split(':').map(Number);
  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day) ||
    !Number.isInteger(hour) ||
    !Number.isInteger(minute) ||
    !Number.isInteger(second) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31 ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59 ||
    second < 0 ||
    second > 59
  ) {
    return null;
  }

  const timestamp = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  if (
    timestamp.getUTCFullYear() !== year ||
    timestamp.getUTCMonth() !== month - 1 ||
    timestamp.getUTCDate() !== day ||
    timestamp.getUTCHours() !== hour ||
    timestamp.getUTCMinutes() !== minute ||
    timestamp.getUTCSeconds() !== second
  ) {
    return null;
  }

  return timestamp.toISOString();
}

function cleanRawLine(line) {
  return String(line || '').replace(/\u0000/g, '').trim();
}

function cleanLabel(value) {
  return stripTags(value).replace(/\s+/g, ' ').trim();
}

function stripTags(value) {
  return String(value || '').replace(/<[^>]+>/g, '');
}

function withId(event) {
  const identity = {
    kind: event.kind,
    eventTime: event.eventTime,
    direction: event.direction || null,
    sourceLabel: event.sourceLabel || null,
    targetLabel: event.targetLabel || null,
    amount: event.amount ?? null,
    rawLineHash: event.rawLineHash
  };

  return {
    id: sha256(JSON.stringify(identity)).slice(0, 16),
    ...event
  };
}

function sha256(value) {
  return crypto.createHash('sha256').update(String(value)).digest('hex');
}

module.exports = {
  HIT_QUALITIES,
  INCOMING_DAMAGE_COLOR,
  MAX_LINE_LENGTH,
  OUTGOING_DAMAGE_COLOR,
  parseEveLogLine,
  parseEveTimestamp
};
