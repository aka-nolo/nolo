import { chromium } from 'playwright';
import fs from 'fs';
const b = await chromium.launch({ channel: 'chrome' });
const size = { width: 1280, height: 800 };
const marks = {};
const smooth = async (p, dy, steps = 60, dx = 0, wait = 22) => { for (let i = 0; i < steps; i++) { await p.mouse.wheel(dx / steps, dy / steps); await p.waitForTimeout(wait); } };
async function rec(name, fn) {
  const ctx = await b.newContext({ viewport: size, recordVideo: { dir: 'out/' + name, size } });
  const p = await ctx.newPage(); const t0 = Date.now();
  await fn(p, () => (marks[name] = (Date.now() - t0) / 1000));
  await ctx.close();
}
await rec('formwrks', async (p, mark) => {
  await p.goto('https://formwrks.co/', { waitUntil: 'networkidle' });
  await p.getByText('TAP', { exact: false }).first().click(); await p.waitForTimeout(3200);
  await p.mouse.move(700, 500); mark();
  await p.waitForTimeout(800);
  await smooth(p, 2600, 140, 0, 40);
  await p.waitForTimeout(800);
});
await rec('tech', async (p, mark) => {
  await p.goto('https://tech.formwrks.co/', { waitUntil: 'networkidle' });
  await p.getByText('TAP', { exact: false }).first().click(); await p.waitForTimeout(2500);
  const card = p.locator('button.app', { hasText: 'BIM Bridge' });
  await card.scrollIntoViewIfNeeded(); await p.evaluate(() => window.scrollBy(0, -200)); await p.waitForTimeout(1200);
  await p.mouse.move(640, 400); mark();
  await p.waitForTimeout(900);
  await card.hover(); await p.waitForTimeout(700); await card.click(); await p.waitForTimeout(1800);
  await p.mouse.move(640, 420);
  await smooth(p, 1600, 110, 0, 40);
  await p.waitForTimeout(1000);
});
await rec('nope', async (p, mark) => {
  await p.goto('https://www.nopestudios.co/work', { waitUntil: 'networkidle' }); await p.waitForTimeout(2500);
  await p.mouse.move(640, 400); mark();
  await p.waitForTimeout(900);
  await smooth(p, 2400, 150, 0, 40);
  await p.waitForTimeout(800);
});
await b.close();
fs.writeFileSync('marks.json', JSON.stringify(marks)); console.log(marks);
