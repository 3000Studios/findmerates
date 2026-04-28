import { test, expect } from "@playwright/test";

const isProbablyExternal = (href: string) => /^https?:\/\//i.test(href);

test("all visible links/buttons are actionable", async ({ page, request, baseURL }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const issues: string[] = [];

  const elements = page.locator("a, button, [role='button']");
  const count = await elements.count();

  for (let i = 0; i < count; i++) {
    const el = elements.nth(i);
    if (!(await el.isVisible())) continue;
    if (!(await el.isEnabled())) continue;

    const tag = (await el.evaluate((n) => n.tagName.toLowerCase())) as string;
    const text = (await el.innerText().catch(() => "")).trim().slice(0, 80);

    if (tag === "a") {
      const href = (await el.getAttribute("href")) ?? "";
      const ariaDisabled = await el.getAttribute("aria-disabled");
      const isDisabled = ariaDisabled === "true";

      if (isDisabled) continue;

      if (!href || href === "#" || href.toLowerCase().startsWith("javascript:")) {
        issues.push(`Bad link href "${href}" on <a> text="${text}"`);
        continue;
      }

      if (href.startsWith("/")) {
        const url = new URL(href, baseURL ?? "http://127.0.0.1:4173").toString();
        const res = await request.get(url);
        if (!res.ok()) issues.push(`Broken internal link ${href} (${res.status()}) text="${text}"`);
        continue;
      }

      if (isProbablyExternal(href)) {
        const res = await request.get(href).catch(() => null);
        if (!res || !(res.ok() || [301, 302, 303, 307, 308].includes(res.status()))) {
          issues.push(`External link not reachable ${href} text="${text}"`);
        }
      }
      continue;
    }

    if (tag === "button") {
      const type = (await el.getAttribute("type")) ?? "button";
      if (type === "submit") {
        const form = el.locator("xpath=ancestor::form[1]");
        if ((await form.count()) === 0) issues.push(`Submit button without form text="${text}"`);
      }
      continue;
    }
  }

  expect(issues, issues.join("\n")).toEqual([]);
});

