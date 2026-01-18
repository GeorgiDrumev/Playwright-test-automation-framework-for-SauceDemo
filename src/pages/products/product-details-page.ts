import { Page, Locator, expect } from "@playwright/test";
import { ProductData } from "@data/test-data/product-data";
import { BasePage } from "@/pages/base-page";

export interface ActualProductDetails {
  name: string;
  description: string;
  price: string;
}

export class ProductDetailsPage extends BasePage {
  readonly productName: Locator;
  readonly productDescription: Locator;
  readonly productPrice: Locator;
  readonly productImage: Locator;
  readonly addToCartButton: Locator;
  readonly removeButton: Locator;
  readonly backButton: Locator;
  readonly url = "https://www.saucedemo.com/inventory-item.html";
  readonly screenshotFolder = "product-details";

  constructor(page: Page) {
    super(page);
    this.productName = page.locator(".inventory_details_name");
    this.productDescription = page.locator(".inventory_details_desc");
    this.productPrice = page.locator(".inventory_details_price");
    this.productImage = page.locator(".inventory_details_img");
    this.addToCartButton = page.locator('[data-test^="add-to-cart"]');
    this.removeButton = page.locator('[data-test^="remove"]');
    this.backButton = page.locator('[data-test="back-to-products"]');
  }

  public async goto(productId?: number): Promise<void> {
    if (productId !== undefined) {
      await this.page.goto(`${this.url}?id=${productId}`);
    } else {
      await super.goto();
    }
  }

  public async getProductName(): Promise<string> {
    return (await this.productName.textContent()) || "";
  }

  public async getProductDescription(): Promise<string> {
    return (await this.productDescription.textContent()) || "";
  }

  public async getProductPrice(): Promise<string> {
    return (await this.productPrice.textContent()) || "";
  }

  public async addToCart() {
    await this.addToCartButton.click();
  }

  public async removeFromCart() {
    await this.removeButton.click();
  }

  public async clickBackButton() {
    await this.backButton.click();
  }

  public async isProductInCart(): Promise<boolean> {
    return await this.removeButton.isVisible();
  }

  public async verifyProductDetails(expectedProduct: ProductData) {
    const actualDetails = {
      name: await this.getProductName(),
      description: await this.getProductDescription(),
      price: await this.getProductPrice(),
    };

    expect(actualDetails.name).toBe(expectedProduct.name);
    expect(actualDetails.description).toBe(expectedProduct.description);
    expect(actualDetails.price).toBe(`$${expectedProduct.price}`);
  }

  public async verifyProductIsInCart() {
    const isInCart = await this.isProductInCart();
    expect(isInCart).toBeTruthy();
  }

  public async verifyProductNotInCart() {
    const isInCart = await this.isProductInCart();
    expect(isInCart).toBeFalsy();
  }

  public async verifyPageNotLoaded() {
    const isNameVisible = await this.productName.isVisible();
    expect(isNameVisible).toBeFalsy();
  }
}
