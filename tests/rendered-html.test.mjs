import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the KinetiQ landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="zh-Hant">/i);
  assert.match(html, /<title>KinetiQ｜個人化智慧肌貼導引<\/title>/i);
  assert.match(html, /從不適關節與症狀開始/);
  assert.match(html, /開始個人化導引/);
  assert.match(html, /本服務為操作輔助，不能取代醫療診斷/);
  assert.match(html, /src="\/kinetiq-home\.png"/);
});

test("keeps the KinetiQ source and Sites configuration ready", async () => {
  const [page, layout, packageJson, hosting] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /export default function Home/);
  assert.match(page, /開始個人化導引/);
  assert.match(layout, /title:\s*"KinetiQ｜個人化智慧肌貼導引"/);
  assert.match(packageJson, /"build": "vinext build"/);
  assert.match(hosting, /"project_id": "appgprj_[a-f0-9]+"/);
  assert.match(hosting, /"d1": null/);
  assert.match(hosting, /"r2": null/);
});
