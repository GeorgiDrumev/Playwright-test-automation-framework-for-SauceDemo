import { Page, Locator, expect } from "@playwright/test";
import { WaitUtils } from "@/utils/wait-utils";
import { BasePage } from "@/pages/base-page";

export class CheckoutDetailsPage extends BasePage {
  readonly pageTitle: Locator;
  readonly waitUtils: WaitUtils;
  readonly cartItems: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;
  readonly url = "https://www.saucedemo.com/checkout-step-two.html";
  readonly screenshotFolder = "checkout";

  constructor(page: Page) {
    super(page);
    this.waitUtils = new WaitUtils(page);
    this.pageTitle = page.locator(".title");
    this.cartItems = page.locator(".cart_item");
    this.subtotalLabel = page.locator(".summary_subtotal_label");
    this.taxLabel = page.locator(".summary_tax_label");
    this.totalLabel = page.locator(".summary_total_label");
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
  }

  public async getPageTitle(): Promise<string> {
    return (await this.pageTitle.textContent()) || "";
  }

  public async getCartItemsCount(): Promise<number> {
    return await this.cartItems.count();
  }

  public async getSubtotal(): Promise<string> {
    return (await this.subtotalLabel.textContent()) || "";
  }

  public async getTax(): Promise<string> {
    return (await this.taxLabel.textContent()) || "";
  }

  public async getTotal(): Promise<string> {
    return (await this.totalLabel.textContent()) || "";
  }

  public async clickFinish() {
    await this.finishButton.click();
  }

  public async clickCancel() {
    await this.cancelButton.click();
  }

  public async verifyPageLoaded() {
    await this.waitUtils.waitForNetworkIdle();
    await expect(this.pageTitle).toBeVisible();
    await expect(this.pageTitle).toHaveText("Checkout: Overview");
  }

  public async verifyItemCount(expectedCount: number) {
    const actualCount = await this.getCartItemsCount();
    expect(actualCount).toBe(expectedCount);
  }

  public async verifyOrderSummaryDisplayed() {
    await expect(this.subtotalLabel).toBeVisible();
    await expect(this.taxLabel).toBeVisible();
    await expect(this.totalLabel).toBeVisible();
  }

  public async verifyTotalsCalculation() {
    const subtotalText = await this.getSubtotal();
    const taxText = await this.getTax();
    const totalText = await this.getTotal();

    const subtotal = parseFloat(subtotalText.replace("Item total: $", ""));
    const tax = parseFloat(taxText.replace("Tax: $", ""));
    const total = parseFloat(totalText.replace("Total: $", ""));

    const expectedTotal = parseFloat((subtotal + tax).toFixed(2));
    expect(total).toBe(expectedTotal);
  }
}
