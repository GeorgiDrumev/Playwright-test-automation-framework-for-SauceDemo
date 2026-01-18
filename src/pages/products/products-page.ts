import { Page, Locator, expect } from "@playwright/test";
import { WaitUtils } from "@/utils/wait-utils";
import { SortOption, SortOrder } from "@/types/sort-types";
import { ProductData } from "@data/test-data/product-data";
import { BasePage } from "@/pages/base-page";
import { BurgerMenu } from "@/pages/components/burger-menu";

export class ProductsPage extends BasePage {
  private readonly pageTitle: Locator;
  private readonly inventoryItems: Locator;
  private readonly sortDropdown: Locator;
  private readonly cartBadge: Locator;
  private readonly cartIcon: Locator;
  readonly waitUtils: WaitUtils;
  readonly url = "https://www.saucedemo.com/inventory.html";
  readonly screenshotFolder = "products";
  readonly burgerMenu: BurgerMenu;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator(".title");
    this.inventoryItems = page.locator(".inventory_item");
    this.sortDropdown = page.locator(".product_sort_container");
    this.cartBadge = page.locator(".shopping_cart_badge");
    this.cartIcon = page.locator(".shopping_cart_link");
    this.waitUtils = new WaitUtils(page);
    this.burgerMenu = new BurgerMenu(page);
  }

  public async goto() {
    await super.goto();
    await this.waitUtils.waitForNetworkIdle();
  }

  public async getInventoryItemsCount(): Promise<number> {
    return await this.inventoryItems.count();
  }

  public async sortProducts(option: SortOption) {
    await this.sortDropdown.selectOption(option);
    await this.waitUtils.waitForDomContentLoaded();
  }

  public async getProductNames(): Promise<string[]> {
    const names = await this.page
      .locator(".inventory_item_name")
      .allTextContents();
    return names;
  }

  public async getProductPrices(): Promise<number[]> {
    const priceTexts = await this.page
      .locator(".inventory_item_price")
      .allTextContents();
    return priceTexts.map((price) => parseFloat(price.replace("$", "")));
  }

  public async addProductToCart(productName: string) {
    await this.inventoryItems
      .filter({ hasText: productName })
      .locator('[data-test^="add-to-cart"]')
      .click();
  }

  public async addProductToCartByIndex(index: number) {
    await this.inventoryItems
      .nth(index)
      .locator('[data-test^="add-to-cart"]')
      .click();
  }

  public async removeProductFromCart(productName: string) {
    await this.inventoryItems
      .filter({ hasText: productName })
      .locator('[data-test^="remove"]')
      .click();
  }

  public async removeProductFromCartByIndex(index: number) {
    await this.inventoryItems
      .nth(index)
      .locator('[data-test^="remove"]')
      .click();
  }

  public async getCartBadgeCount(): Promise<string> {
    if (await this.cartBadge.isVisible()) {
      return (await this.cartBadge.textContent()) || "0";
    }
    return "0";
  }

  public async navigateToCart() {
    await this.cartIcon.click();
  }

  public async navigateToProductDetails(productName: string) {
    await this.page
      .locator(`.inventory_item_name:text("${productName}")`)
      .click();
  }

  public async navigateToProductDetailsByIndex(index: number) {
    await this.inventoryItems
      .nth(index)
      .locator(".inventory_item_name")
      .click();
  }

  public async isProductInCart(productName: string): Promise<boolean> {
    return await this.inventoryItems
      .filter({ hasText: productName })
      .locator('[data-test^="remove"]')
      .isVisible();
  }

  public async verifyPageLoaded() {
    await this.waitUtils.waitForNetworkIdle();
    await expect(this.pageTitle).toBeVisible();
    await expect(this.pageTitle).toHaveText("Products");
  }

  public async verifyProductsAreDisplayed() {
    const itemCount = await this.getInventoryItemsCount();
    expect(itemCount).toBeGreaterThan(0);
  }

  public async verifyCartBadgeCount(expectedCount: string) {
    const actualCount = await this.getCartBadgeCount();
    expect(actualCount).toBe(expectedCount);
  }

  public async verifyProductCount(expectedCount: number) {
    const actualCount = await this.getInventoryItemsCount();
    expect(actualCount).toBe(expectedCount);
  }

  public async verifyProductNames(expectedProducts: ProductData[]) {
    const actualProductNames = await this.getProductNames();
    expectedProducts.forEach((product) => {
      expect(actualProductNames).toContain(product.name);
    });
  }

  public async verifyProductIsInCart(productName: string) {
    const isInCart = await this.isProductInCart(productName);
    expect(isInCart).toBeTruthy();
  }

  public async verifyCartBadgeNotVisible() {
    await expect(this.cartBadge).not.toBeVisible();
  }

  public async verifyProductsSortedByName(
    expectedProducts: ProductData[],
    order: SortOrder,
  ) {
    const actualProductNames = await this.getProductNames();
    const sorted = expectedProducts.map((p) => p.name).sort();
    const expectedOrder =
      order === SortOrder.ASCENDING ? sorted : sorted.reverse();
    expect(actualProductNames).toEqual(expectedOrder);
  }

  public async verifyProductsSortedByPrice(
    expectedProducts: ProductData[],
    order: SortOrder,
  ) {
    const actualPrices = await this.getProductPrices();
    const expectedOrder = expectedProducts
      .map((p) => p.price)
      .sort((a, b) => (order === SortOrder.ASCENDING ? a - b : b - a));
    expect(actualPrices).toEqual(expectedOrder);
  }
}
