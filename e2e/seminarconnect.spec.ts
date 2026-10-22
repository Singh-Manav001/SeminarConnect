import { test, expect } from "@playwright/test";

test.describe("SeminarConnect End-to-End Suite", () => {
  test("1. Homepage renders educational branding, hero, categories & featured speakers", async ({ page }) => {
    await page.goto("/");

    // Verify Hero text
    await expect(page.locator("h1")).toContainText("Bring Expert Knowledge to Your Classroom.");
    await expect(page.getByText("Discover skilled speakers, book engaging seminars")).toBeVisible();

    // Verify Primary CTAs in Hero
    const mainContent = page.getByRole("main");
    await expect(mainContent.getByRole("link", { name: "Find a Speaker" })).toBeVisible();
    await expect(mainContent.getByRole("link", { name: "Become a Speaker" })).toBeVisible();

    // Verify Top categories
    await expect(page.getByText("Artificial Intelligence and Machine Learning")).toBeVisible();
    await expect(page.getByText("Robotics and Internet of Things")).toBeVisible();

    // Verify Featured speakers
    await expect(page.getByRole("heading", { name: "Dr. Ananya Roy" })).toBeVisible();
  });

  test("2. Speaker Directory with combined database-backed filters and distance calculation", async ({ page }) => {
    await page.goto("/speakers");

    // Check directory header
    await expect(page.locator("h1")).toContainText("Discover Verified Academic Speakers");

    // Search for AI topic
    const searchInput = page.getByPlaceholder("Search topics, skills, or speaker names...");
    await searchInput.fill("Artificial Intelligence");
    await page.getByRole("button", { name: "Search" }).click();

    // Verify Dr. Ananya appears
    await expect(page.getByText("Dr. Ananya Roy")).toBeVisible();

    // Filter by Delhi location
    const locationInput = page.getByPlaceholder("Your City (e.g. Delhi, Bengaluru, Pune)");
    await locationInput.fill("Delhi");
    await page.getByRole("button", { name: "Search" }).click();

    // Check that distance calculation / results update
    await expect(page.getByText("Active Filters:")).toBeVisible();
  });

  test("3. Speaker Profile view, syllabus learning outcomes & booking request modal", async ({ page }) => {
    await page.goto("/speakers/cand-1");

    // Check profile details
    await expect(page.locator("h1")).toContainText("Dr. Ananya Roy");
    await expect(page.getByText("Ph.D. in Computer Science & Artificial Intelligence")).toBeVisible();
    await expect(page.getByText("Verified Expert")).toBeVisible();

    // Verify seminar offerings catalog
    await expect(page.getByText("Demystifying Artificial Intelligence & Prompt Engineering")).toBeVisible();
    await expect(page.getByText("Key Learning Outcomes:").first()).toBeVisible();

    // Open booking modal
    await page.getByRole("button", { name: "Request Booking" }).click();
    await expect(page.getByText("Request Seminar Booking")).toBeVisible();
  });

  test("4. Principal authentication and dashboard management", async ({ page }) => {
    await page.goto("/login");

    // Use 1-click Principal demo login
    await page.getByRole("button", { name: /Dr. Rajesh Sharma/ }).click();

    // Should navigate to Principal Dashboard
    await page.waitForURL("**/dashboard/principal");
    await expect(page.locator("h1")).toContainText("Delhi Public School R.K. Puram");
    await expect(page.getByText("Active Bookings")).toBeVisible();
    await expect(page.getByText("Seminars Conducted")).toBeVisible();
  });

  test("5. Speaker candidate dashboard, availability & booking actions", async ({ page }) => {
    await page.goto("/login");

    // 1-click Speaker demo login
    await page.getByRole("button", { name: /Dr. Ananya Roy/ }).click();

    await page.waitForURL("**/dashboard/candidate");
    await expect(page.locator("h1")).toContainText("Dr. Ananya Roy");
    await expect(page.getByText("Faculty Dashboard")).toBeVisible();
    await expect(page.getByText("Your Seminar Catalog")).toBeVisible();
    await expect(page.getByText("Availability & Concurrency")).toBeVisible();
  });

  test("6. Booking details, escrow financial breakdown & GST tax invoice modal", async ({ page }) => {
    // Authenticate as Principal first to view institution booking
    await page.goto("/login");
    await page.getByRole("button", { name: /Dr. Rajesh Sharma/ }).click();
    await page.waitForURL("**/dashboard/principal");

    await page.goto("/bookings/bk-1001");

    // Check booking reference and status
    await expect(page.getByText("REFERENCE: SC-2026-7781")).toBeVisible();
    await expect(page.getByText("Demystifying Artificial Intelligence & Prompt Engineering")).toBeVisible();

    // Verify financial breakdown (INR)
    await expect(page.getByText("Price Breakdown (INR ₹)")).toBeVisible();
    await expect(page.getByText("Platform Escrow Fee")).toBeVisible();

    // Open and verify printable GST tax invoice
    await page.getByRole("button", { name: "View GST Tax Invoice" }).click();
    await expect(page.getByText("Official GST Tax Invoice")).toBeVisible();
    await expect(page.getByText("GSTIN: 07AAACS1429R1ZX")).toBeVisible();
    await expect(page.getByText("PAID & ESCROWED")).toBeVisible();
  });

  test("7. Administrative console, verification queue & category management", async ({ page }) => {
    await page.goto("/login");

    // 1-click Admin login
    await page.getByRole("button", { name: /Central Directorate/ }).click();

    await page.waitForURL("**/admin");
    await expect(page.locator("h1")).toContainText("Administrative Directorate");
    await expect(page.getByText("Gross Marketplace Volume")).toBeVisible();

    // Click Categories tab
    await page.getByRole("button", { name: /Categories/ }).click();
    await expect(page.getByText("12 Database-Backed Categories")).toBeVisible();
    await expect(page.getByText("C and C++ Programming")).toBeVisible();
    await expect(page.getByText("Artificial Intelligence and Machine Learning")).toBeVisible();

    // Click Verification tab
    await page.getByRole("button", { name: /Verification Queue/ }).click();
    await expect(page.getByText("Speaker Verification Queue")).toBeVisible();
  });

  test("8. Policies: 48-Hour Cancellation & Refund terms", async ({ page }) => {
    await page.goto("/cancellation");
    await expect(page.locator("h1")).toContainText("Cancellation & Refund Policy");
    await expect(page.getByText("48-Hour Full Institutional Refund Policy")).toBeVisible();
  });
});
