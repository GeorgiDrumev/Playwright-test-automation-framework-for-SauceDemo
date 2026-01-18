import { Page, Locator, expect } from "@playwright/test";
import { WaitUtils } from "@/utils/wait-utils";
import { BasePage } from "@/pages/base-page";

export class CheckoutUserInformationPage extends BasePage {
  readonly pageTitle: Locator;
  readonly waitUtils: WaitUtils;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;
  readonly url = "https://www.saucedemo.com/checkout-step-one.html";
  readonly screenshotFolder = "checkout";

  constructor(page: Page) {
    super(page);
    this.waitUtils = new WaitUtils(page);
    this.pageTitle = page.locator(".title");
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  public async fillCheckoutInformation(
    firstName: string,
    lastName: string,
    postalCode: string,
  ) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  public async clickContinue() {
    await this.continueButton.click();
  }

  public async clickCancel() {
    await this.cancelButton.click();
  }

  public async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent()) || "";
  }

  public async isErrorDisplayed(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  public async verifyPageLoaded() {
    await this.waitUtils.waitForNetworkIdle();
    await expect(this.pageTitle).toBeVisible();
    await expect(this.pageTitle).toHaveText("Checkout: Your Information");
  }

  public async verifyErrorMessageDisplayed(expectedMessage: string) {
    await expect(this.errorMessage).toBeVisible();
    const actualMessage = await this.getErrorMessage();
    expect(actualMessage).toContain(expectedMessage);
  }
}
