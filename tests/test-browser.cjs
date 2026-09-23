// Optional integration suite: npm install; npx playwright install; npm run test:browser
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium, firefox, webkit } = require('playwright');
const root = path.join(__dirname, '..');
const output = process.env.QA_DIR;
const engines = { chromium, firefox, webkit };
let localFiles;

function wav(name, seconds = 12) {
  const count = 48000 * seconds, buffer = Buffer.alloc(44 + count * 2);
  buffer.write('RIFF'); buffer.writeUInt32LE(buffer.length - 8, 4);
  buffer.write('WAVEfmt ', 8); buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(48000, 24); buffer.writeUInt32LE(96000, 28);
  buffer.writeUInt16LE(2, 32); buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36); buffer.writeUInt32LE(count * 2, 40);
  for (let i = 0; i < count; i++) buffer.writeInt16LE(Math.round(Math.sin(i * Math.PI / 55) * 3000), 44 + i * 2);
  return { name, mimeType: 'audio/wav', buffer };
}
const files = [wav('reference.wav'), wav('candidate.wav', 10)];
const snapshot = page => page.evaluate(() => window.Timbre.snapshot());
const slide = (page, value) => page.locator('#pan').evaluate((el, v) => {
  el.value = String(v); el.dispatchEvent(new Event('input', { bubbles: true }));
}, value);
async function checkWidth(page) {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'no page overflow');
}
async function screenshot(page, name) {
  if (output) await page.screenshot({ path: path.join(output, 'screenshots', name + '.png'), fullPage: true });
}
async function run(engine, base) {
  const browser = await engines[engine].launch({ headless: true,
    ...(engine === 'webkit' && process.env.WEBKIT_PATH ? {executablePath:process.env.WEBKIT_PATH} : {}),
    ...(engine === 'chromium' && process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}) });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1100 } });
    const page = await context.newPage(), errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    // Deterministic demo responses; no third-party requests or codec dependencies.
    await context.route('https://**/*', route => route.fulfill({ contentType: 'audio/wav', body: files[0].buffer }));
    await page.goto(base);
    await page.waitForFunction(() => Timbre.snapshot().ready === 2);
    await page.locator('#file-input').setInputFiles(localFiles);
    await page.waitForFunction(() => Timbre.snapshot().files.filter(f => f.status === 'ready' && f.name.endsWith('.wav') && !f.id.startsWith('demo')).length === 2);
    assert.equal(errors.length, 0, 'navigation/import console');
    await page.selectOption('#zoom', '4');
    assert.equal(await page.locator('#pan-wrap').isVisible(), true);
    await page.locator('#wave-A').hover();
    await page.mouse.wheel(150, 0); await page.waitForTimeout(100);
    assert.ok((await snapshot(page)).pan > 0, 'native horizontal wheel');
    await slide(page, 0);
    await page.keyboard.down('Shift'); await page.mouse.wheel(0, 150); await page.keyboard.up('Shift');
    await page.waitForTimeout(100);
    assert.ok((await snapshot(page)).pan > 0, 'Shift wheel');
    const beforeVertical = (await snapshot(page)).pan;
    await page.locator('#wave-A').dispatchEvent('wheel', { deltaY: 100, bubbles: true, cancelable: true });
    assert.equal((await snapshot(page)).pan, beforeVertical, 'vertical wheel leaves timeline alone');
    await page.locator('#wave-A').dispatchEvent('wheel', { deltaX: 100, ctrlKey: true, cancelable: true });
    assert.equal((await snapshot(page)).pan, beforeVertical, 'browser pinch/zoom not intercepted');
    await page.locator('#wave-A').dispatchEvent('wheel', { deltaX: 1, deltaMode: 1, cancelable: true });
    assert.ok((await snapshot(page)).pan > beforeVertical, 'line wheel units');
    await slide(page, 500);
    const previousCenter = 12 * .5 * (1 - 1 / 4) + 12 / 8;
    await page.selectOption('#zoom', '8');
    const state = await snapshot(page), center = state.pan * (12 - 12 / 8) + 12 / 16;
    assert.ok(Math.abs(center - previousCenter) < .001, 'zoom preserves visible center when playhead is offscreen');
    await page.click('#tool-pan');
    const box = await page.locator('#wave-A').boundingBox();
    const beforeDrag = (await snapshot(page)).pan;
    await page.mouse.move(box.x + box.width * .7, box.y + box.height / 2);
    await page.mouse.down(); await page.mouse.move(box.x + box.width * .4, box.y + box.height / 2, { steps: 5 }); await page.mouse.up();
    assert.ok((await snapshot(page)).pan > beforeDrag, 'mouse Pan drag');
    assert.equal((await snapshot(page)).draft, null, 'Pan does not paint');
    await page.click('#tool-paint');
    await page.mouse.move(box.x + box.width * .2, box.y + box.height / 2);
    await page.mouse.down(); await page.mouse.move(box.x + box.width * .4, box.y + box.height / 2, {steps:4}); await page.mouse.up();
    assert.ok((await snapshot(page)).selection.end > (await snapshot(page)).selection.start, 'paint still selects after Pan');
    await page.click('#cancel-note');
    await page.click('#restart');
    await page.locator('#wave-B').focus(); await page.keyboard.press('Home');
    assert.equal((await snapshot(page)).pan, 0);
    await page.keyboard.press('Shift+ArrowRight'); assert.ok((await snapshot(page)).pan > 0);
    await page.keyboard.press('End'); assert.equal((await snapshot(page)).pan, 1);
    await page.keyboard.press('Home'); await page.keyboard.press('ArrowRight');
    assert.ok((await snapshot(page)).position > 0, 'keyboard seek');
    if (process.env.SKIP_PLAYBACK !== '1') {
      await page.check('#follow-playhead');
      await page.click('#monitor-A');
      await page.waitForFunction(() => Timbre.snapshot().pan > 0, null, { timeout: 15000 });
      await slide(page, 300); assert.equal(await page.isChecked('#follow-playhead'), false, 'manual pan disables follow');
      await page.click('#play-toggle');
    } else console.log(`UNVERIFIED ${engine}: playback/follow explicitly skipped`);
    await page.click('#manual-region');
    await page.fill('#region-start', '0.200'); await page.fill('#region-end', '0.800');
    await page.fill('#note-heard', 'Saved observation'); await page.click('#save-note');
    assert.equal((await snapshot(page)).notes.length, 1);
    await page.fill('#note-heard', 'Unsaved observation');
    await page.fill('#region-end', '0.100');
    assert.equal(await page.locator('#editor-error').isVisible(), true);
    await page.click('#undo');
    assert.equal((await snapshot(page)).notes.length, 1, 'dirty Undo preserves saved note');
    assert.equal(await page.inputValue('#note-heard'), 'Unsaved observation', 'dirty Undo preserves draft');
    await page.click('#open-library'); await page.click('#save-session');
    assert.match(await page.textContent('#toast'), /Save or discard/);
    await page.click('#library-close');
    const dialogs = [];
    page.on('dialog', async dialog => { dialogs.push(dialog.type()); await dialog.accept(); });
    await page.reload();
    assert.equal(await page.inputValue('#note-heard'), 'Unsaved observation', 'draft restored after reload');
    assert.equal(await page.inputValue('#region-end'), '0.100', 'invalid raw range preserved for correction');
    assert.ok(dialogs.includes('beforeunload'), 'dirty reload warns');
    await page.locator('#file-input').setInputFiles([...localFiles].reverse());
    await page.waitForFunction(() => Timbre.snapshot().ready === 2);
    assert.equal(await page.inputValue('#note-heard'), 'Unsaved observation', 'reconnect same audio preserves draft');
    await page.fill('#region-end', '0.900'); await page.click('#save-note');
    assert.equal((await snapshot(page)).notes[0].heard, 'Unsaved observation');
    await page.click('#cancel-note');
    await page.click('#open-library');
    const downloadEvent = page.waitForEvent('download'); await page.click('#save-session');
    const download = await downloadEvent;
    const session = JSON.parse(fs.readFileSync(await download.path(), 'utf8'));
    assert.equal(session.browserDraft, undefined, 'exports contain only saved notes');
    await page.locator('#session-input').setInputFiles({ name: 'invalid.json', mimeType: 'application/json', buffer: Buffer.from('{}') });
    assert.equal((await snapshot(page)).notes.length, 1, 'invalid session keeps workspace');
    await page.locator('#session-input').setInputFiles({ name: 'session.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(session)) });
    await page.waitForFunction(() => Timbre.snapshot().ready === 2);
    assert.equal((await snapshot(page)).notes.length, 1);
    await page.click('#library-close');
    await page.selectOption('#zoom', '4'); await page.click('#tool-pan');
    await checkWidth(page); await screenshot(page, engine + '-desktop');
    assert.deepEqual(errors, [], 'no console/page errors after interactions');
    // No-storage mode must retain an editable workspace and tell the user backup failed.
    await page.evaluate(() => { Storage.prototype.setItem = () => { throw new Error('Storage disabled'); }; });
    await page.click('#manual-region'); await page.fill('#note-heard', 'No-storage draft');
    await page.waitForTimeout(250);
    assert.match(await page.textContent('#session-status'), /unavailable/);
    await page.click('#cancel-note');
    await page.evaluate(() => { AudioContext.prototype.resume = () => new Promise(() => {}); });
    await page.click('#monitor-A');
    await page.waitForFunction(() => document.getElementById('banner').textContent.includes('Audio output did not start'), null, {timeout:8000});
    assert.equal((await snapshot(page)).playing, false, 'stalled audio has bounded error feedback');
    assert.deepEqual(errors, [], 'console after storage and stalled-audio checks');
    await context.close();

    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
    const touchPage = await mobile.newPage();
    const mobileErrors = [];
    touchPage.on('pageerror', error => mobileErrors.push(error.message));
    touchPage.on('console', message => { if (message.type() === 'error') mobileErrors.push(message.text()); });
    await mobile.route('https://**/*', route => route.fulfill({ contentType: 'audio/wav', body: files[0].buffer }));
    await touchPage.goto(base); await touchPage.waitForFunction(() => Timbre.snapshot().ready === 2);
    await touchPage.locator('#wave-A').dispatchEvent('wheel',{deltaX:120,cancelable:true});
    assert.equal((await snapshot(touchPage)).pan,0,'1x cannot pan');
    await touchPage.selectOption('#zoom', '4'); await touchPage.click('#tool-pan');
    // Real touch dispatch on Chromium; synthetic pointer dispatch on other engines is NOT physical touch proof.
    if (engine === 'chromium') {
      const cdp = await mobile.newCDPSession(touchPage);
      await touchPage.locator('#wave-A').scrollIntoViewIfNeeded();
      const area = await touchPage.locator('#wave-A').boundingBox();
      const x = area.x + area.width * .8, y = area.y + area.height / 2;
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x - 80, y }] });
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      assert.ok((await snapshot(touchPage)).pan > 0, 'emulated touch Pan');
      await cdp.send('Input.dispatchTouchEvent', {type:'touchStart',touchPoints:[{x,y}]});
      await cdp.send('Input.dispatchTouchEvent', {type:'touchCancel',touchPoints:[]});
      const beforeRetry=(await snapshot(touchPage)).pan;
      await cdp.send('Input.dispatchTouchEvent', {type:'touchStart',touchPoints:[{x,y}]});
      await cdp.send('Input.dispatchTouchEvent', {type:'touchMove',touchPoints:[{x:x-40,y}]});
      await cdp.send('Input.dispatchTouchEvent', {type:'touchEnd',touchPoints:[]});
      assert.ok((await snapshot(touchPage)).pan>beforeRetry,'cancelled touch releases Pan state');
      assert.equal((await snapshot(touchPage)).draft, null);
    }
    await checkWidth(touchPage); await screenshot(touchPage, engine + '-mobile-390');
    await touchPage.setViewportSize({ width: 320, height: 800 });
    await checkWidth(touchPage); await screenshot(touchPage, engine + '-mobile-320');
    assert.deepEqual(mobileErrors, [], 'mobile console');
    await mobile.close();
    const localContext=await browser.newContext();
    await localContext.route('https://**/*',route=>route.fulfill({contentType:'audio/wav',body:files[0].buffer}));
    const localPage=await localContext.newPage(),fileErrors=[];
    localPage.on('pageerror',error=>fileErrors.push(error.message));
    localPage.on('console',message=>{if(message.type()==='error')fileErrors.push(message.text());});
    await localPage.goto(require('node:url').pathToFileURL(path.join(root,'index.html')).href);
    await localPage.waitForFunction(()=>Timbre.snapshot().ready===2);
    await localPage.selectOption('#zoom','2');await localPage.locator('#wave-A').focus();await localPage.keyboard.press('End');
    assert.equal((await snapshot(localPage)).pan,1,'file URL navigation smoke');
    assert.deepEqual(fileErrors,[],'file URL console');
    await localContext.close();
    const status=process.env.SKIP_PLAYBACK==='1'?'PARTIAL':'PASS';
    const result={engine,version:browser.version(),status,normalPlayback:status==='PASS'?'Pass':'Unverified',navigation:'Pass',fileUrlSmoke:'Pass',draftAndSessions:'Pass',storageAndAudioErrors:'Pass',viewports:[1440,390,320],touchDispatch:engine==='chromium'?'Emulated pass':'Unverified',consoleErrors:[...errors,...mobileErrors,...fileErrors],sourceSha256:require('node:crypto').createHash('sha256').update(fs.readFileSync(path.join(root,'index.html'))).digest('hex')};
    if(output)fs.writeFileSync(path.join(output,'evidence',engine+'.json'),JSON.stringify(result,null,2)+'\n');
    console.log(`${status} ${engine} ${browser.version()}: navigation, draft/session guards, storage/audio failure, desktop/mobile layout`);
  } finally { await browser.close(); }
}
(async () => {
  const fixtures = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'timbre-test-'));
  localFiles = files.map(file => {const target=path.join(fixtures,file.name);fs.writeFileSync(target,file.buffer);return target;});
  if (output) { fs.mkdirSync(path.join(output, 'screenshots'), { recursive: true }); fs.mkdirSync(path.join(output, 'evidence'), { recursive: true }); }
  const server = http.createServer((request, response) => {
    const file = request.url === '/favicon.svg' ? 'favicon.svg' : request.url === '/' ? 'index.html' : null;
    if (!file) { response.writeHead(404); response.end(); return; }
    response.setHeader('Content-Type', file.endsWith('.svg') ? 'image/svg+xml' : 'text/html');
    response.end(fs.readFileSync(path.join(root, file)));
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try {
    const base = `http://127.0.0.1:${server.address().port}/`;
    for (const name of (process.env.BROWSERS || 'chromium,firefox,webkit').split(',')) await run(name, base);
  } finally { server.close(); fs.rmSync(fixtures,{recursive:true,force:true}); }
})().catch(error => { console.error(error); process.exitCode = 1; });
