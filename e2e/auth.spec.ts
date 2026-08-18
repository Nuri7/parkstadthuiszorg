import { test, expect, type Page } from "@playwright/test";

// De adminomgeving zit achter een wachtwoord-gate (src/proxy.ts + src/lib/adminAuth.ts).
// Het wachtwoord komt uit ADMIN_PASSWORD; playwright.config.ts geeft dezelfde waarde
// door aan de dev-server. Zonder die variabele is de gate fail-closed en slaat de
// test die écht inlogt zichzelf over.
const wachtwoord = process.env.ADMIN_PASSWORD;

/**
 * Vult het inlogformulier in en verstuurt het. Het formulier hangt aan een
 * server-action, die pas werkt zodra React gehydrateerd is; een klik daarvóór
 * doet niets en laat je op /login staan. Daarom proberen we het opnieuw tot de
 * URL verandert (standaard Playwright-remedie tegen die race).
 */
async function login(page: Page, password: string) {
  await page.goto("/login");
  // Wacht tot de chunks binnen zijn; op een koude dev-server duurt compileren en
  // hydrateren anders langer dan de eerste poging hieronder.
  await page.waitForLoadState("networkidle");
  await expect(async () => {
    await page.getByLabel("Wachtwoord").fill(password);
    await page.getByRole("button", { name: "Inloggen" }).click();
    await expect(page).not.toHaveURL(/\/login$/, { timeout: 5000 });
  }).toPass({ timeout: 60_000 });
}

test.describe("Adminafscherming", () => {
  for (const pad of ["/admin", "/admin/pipeline", "/admin/clienten"]) {
    test(`${pad} stuurt bezoekers zonder cookie naar /login`, async ({ page }) => {
      await page.goto(pad);
      await expect(page).toHaveURL(/\/login$/);
      await expect(page.getByRole("button", { name: "Inloggen" })).toBeVisible();
    });
  }

  test("onjuist wachtwoord geeft een foutmelding", async ({ page }) => {
    await login(page, "dit-is-niet-het-wachtwoord");

    await expect(page).toHaveURL(/\/login\?error=1$/);
    await expect(page.getByText("Onjuist wachtwoord")).toBeVisible();
  });

  test("juist wachtwoord geeft toegang tot /admin", async ({ page }) => {
    test.skip(!wachtwoord, "ADMIN_PASSWORD niet gezet — inloggen kan niet getest worden");

    await login(page, wachtwoord!);

    await expect(page).toHaveURL(/\/admin$/);
    // De cookie is gezet: we worden niet teruggestuurd naar het inlogformulier.
    await expect(page.getByRole("button", { name: "Inloggen" })).toHaveCount(0);
  });
});
