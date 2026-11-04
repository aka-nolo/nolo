import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome' });
const size = { width: 1280, height: 800 };
const ctx = await b.newContext({ viewport: size, recordVideo: { dir: 'out/tech', size } });
const p = await ctx.newPage(); const t0 = Date.now();
const smooth = async (dy, steps, wait = 40) => { for (let i = 0; i < steps; i++) { await p.mouse.wheel(0, dy / steps); await p.waitForTimeout(wait); } };
await p.goto('https://tech.formwrks.co/', { waitUntil: 'networkidle' });
await p.getByText('TAP', { exact: false }).first().click(); await p.waitForTimeout(2500);
// Cards that must not appear on camera (names come from the private NO PUBLICAR list, never written here).
const HIDE = (process.env.HIDE_CARDS || '').split(',').map(x => x.trim().toLowerCase()).filter(Boolean);
await p.evaluate((hide) => { document.querySelectorAll('button.app').forEach(b => { if (hide.some(h => b.textContent.toLowerCase().includes(h))) b.style.visibility = 'hidden'; }); }, HIDE);
const card = p.locator('button.app', { hasText: 'BIM Bridge' });
await card.scrollIntoViewIfNeeded(); await p.evaluate(() => window.scrollBy(0, -140)); await p.waitForTimeout(1500);
await p.mouse.move(380, 300);
console.log('start', (Date.now() - t0) / 1000);
await p.waitForTimeout(900);
await card.hover(); await p.waitForTimeout(600); await card.click(); await p.waitForTimeout(2200);
await p.mouse.move(640, 500);
await smooth(520, 50); await p.waitForTimeout(1200);
for (const t of ['We start with the model', 'Reviewing and fixing']) { const el = p.getByText(t, { exact: false }).first(); if (await el.count()) { await el.hover(); await p.waitForTimeout(300); await el.click(); await p.waitForTimeout(1600); } }
await smooth(260, 30); await p.waitForTimeout(1200);
console.log('end', (Date.now() - t0) / 1000);
await ctx.close(); await b.close();
