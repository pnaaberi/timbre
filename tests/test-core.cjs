const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];
assert.ok(scripts.length >= 1, 'expected an inline core script');

const sandbox = { module: { exports: {} }, exports: {}, globalThis: {} };
vm.runInNewContext(scripts[0][1], sandbox, { filename: 'timbre-core.js' });
const core = sandbox.module.exports;

assert.deepEqual(
  JSON.parse(JSON.stringify(core.normalizeRange(0.8, 0.1, 1))),
  { start: 0.1, end: 0.8 }
);
assert.equal(core.normalizeRange(0.1, 0.1, 1), null);
assert.deepEqual(Array.from(core.peakEnvelope([new Float32Array([0, -1, 0.5])], 2)), [0, 1]);

const prompt = core.makePrompt({
  files: [
    { id: 'a', name: 'A.wav', path: 'A.wav', duration: 1, sampleRate: 48000, channels: 1 },
    { id: 'b', name: 'B.wav', path: 'B.wav', duration: 1, sampleRate: 48000, channels: 1 }
  ],
  slots: { A: 'a', B: 'b' },
  notes: [{ fileId: 'b', kind: 'change', start: 0.1, end: 0.2, tags: ['Noise'], heard: 'Noisy transient', wanted: 'Softer attack' }],
  goal: '',
  preferred: null,
  match: false
});
assert.match(prompt, /B\.wav/);
assert.match(prompt, /0\.100–0\.200 s/);
assert.match(prompt, /Noisy transient/);
assert.match(prompt, /Softer attack/);

console.log('Timbre core tests passed.');
