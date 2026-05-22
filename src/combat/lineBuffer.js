function collectCompleteLines({ chunk, partial = '', maxPartialLength = 4096 }) {
  const buffer = `${partial || ''}${chunk || ''}`;
  const hasCompleteEnding = /\r?\n$/.test(buffer);
  const lines = buffer.split(/\r?\n/);
  let nextPartial = '';
  let partialDropped = false;

  if (!hasCompleteEnding) {
    nextPartial = lines.pop() || '';
    if (nextPartial.length > maxPartialLength) {
      nextPartial = '';
      partialDropped = true;
    }
  } else if (lines[lines.length - 1] === '') {
    lines.pop();
  }

  return {
    lines,
    partial: nextPartial,
    partialDropped
  };
}

module.exports = { collectCompleteLines };
