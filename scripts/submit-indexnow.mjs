import { readFile } from "node:fs/promises";
import process from "node:process";

const siteUrl = new URL(process.env.INDEXNOW_SITE_URL ?? "https://parkstadthuiszorg.nl");
const sitemapUrl = new URL("/sitemap.xml", siteUrl);
const key = (
  await readFile(new URL("../public/78ac6eb96677ec6c261dba565636b3e9.txt", import.meta.url), "utf8")
).trim();
const keyLocation = new URL(`/${key}.txt`, siteUrl);
const endpoint = "https://api.indexnow.org/indexnow";
const dryRun = process.argv.includes("--dry-run");

function decodeXml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'");
}

function urlsFromSitemap(xml) {
  const urls = [];
  for (const match of xml.matchAll(/<loc>(.*?)<\/loc>/g)) {
    const url = new URL(decodeXml(match[1]));
    if (url.origin === siteUrl.origin) urls.push(url.href);
  }
  return [...new Set(urls)];
}

async function main() {
  const sitemapResponse = await fetch(sitemapUrl);
  if (!sitemapResponse.ok) {
    throw new Error(`Could not load ${sitemapUrl}: HTTP ${sitemapResponse.status}`);
  }

  const urlList = urlsFromSitemap(await sitemapResponse.text());
  if (urlList.length === 0) {
    console.log("IndexNow: sitemap contained no URLs.");
    return;
  }

  if (dryRun) {
    console.log(`IndexNow dry run: ${urlList.length} URLs would be submitted.`);
    for (const url of urlList) console.log(url);
    return;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: siteUrl.host,
      key,
      keyLocation: keyLocation.href,
      urlList,
    }),
  });

  if (!response.ok) {
    throw new Error(`IndexNow rejected ${urlList.length} URLs: HTTP ${response.status} ${await response.text()}`);
  }

  console.log(`IndexNow accepted ${urlList.length} URLs (HTTP ${response.status}).`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
