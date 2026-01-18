import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "@/pages/base-page";
import { BurgerMenu } from "@/pages/components/burger-menu";

export class CartPage extends BasePage {
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly itemName: Locator;
  readonly removeButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;
  readonly burgerMenu: BurgerMenu;
  readonly url = "https://www.saucedemo.com/cart.html";
  readonly screenshotFolder = "cart";

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator(".title");
    this.cartItems = page.locator(".cart_item");
    this.itemName = page.locator(".inventory_item_name");
    this.removeButton = page.locator('[data-test^="remove"]');
    this.continueShoppingButton = page.locator(
      '[data-test="continue-shopping"]',
    );
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.burgerMenu = new BurgerMenu(page);
  }

  public async getPageTitle(): Promise<string> {
    return (await this.pageTitle.textContent()) || "";
  }

  public async getCartItemsCount(): Promise<number> {
    return await this.cartItems.count();
  }

  public async getCartItemNames(): Promise<string[]> {
    return await this.itemName.allTextContents();
  }

  public async removeItemByName(productName: string) {
    await this.cartItems
      .filter({ hasText: productName })
      .locator(this.removeButton)
      .click();
  }

  public async removeItemByIndex(index: number) {
    await this.cartItems.nth(index).locator(this.removeButton).click();
  }

  public async clickContinueShopping() {
    await this.continueShoppingButton.click();
  }

  public async clickCheckout() {
    await this.checkoutButton.click();
  }

  public async clickItemByName(productName: string) {
    await this.cartItems
      .filter({ hasText: productName })
      .locator(this.itemName)
      .click();
  }

  public async clickItemByIndex(index: number) {
    await this.cartItems.nth(index).locator(this.itemName).click();
  }

  public async isCartEmpty(): Promise<boolean> {
    return (await this.getCartItemsCount()) === 0;
  }

  public async verifyPageLoaded() {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.pageTitle).toHaveText("Your Cart");
  }

  public async verifyCartItemCount(expectedCount: number) {
    const actualCount = await this.getCartItemsCount();
    expect(actualCount).toBe(expectedCount);
  }

  public async verifyCartIsEmpty() {
    const isEmpty = await this.isCartEmpty();
    expect(isEmpty).toBeTruthy();
  }

  public async verifyProductInCart(productName: string) {
    const itemNames = await this.getCartItemNames();
    expect(itemNames).toContain(productName);
  }

  public async verifyProductsInCart(productNames: string[]) {
    const itemNames = await this.getCartItemNames();
    productNames.forEach((name) => {
      expect(itemNames).toContain(name);
    });
  }

  public async verifyCheckoutButtonNotVisible() {
    await expect(this.checkoutButton).not.toBeVisible();
  }
}
