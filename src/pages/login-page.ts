import { Page, Locator, expect } from "@playwright/test";
import { testUsers } from "@data/test-data/user-data";
import { BasePage } from "@/pages/base-page";

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly url = "https://www.saucedemo.com/";
  readonly screenshotFolder = "login";

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  public async login(
    username: string = testUsers.standardUser.username,
    password: string = testUsers.standardUser.password,
  ) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  public async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent()) || "";
  }

  public async isErrorDisplayed(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  public async verifyPageLoaded() {
    await Promise.all([
      expect(this.loginButton).toBeVisible(),
      expect(this.usernameInput).toBeVisible(),
      expect(this.passwordInput).toBeVisible(),
    ]);
  }

  public async verifyErrorMessageIsDisplayed(expectedMessage: string) {
    await expect(this.errorMessage).toBeVisible();
    const actualMessage = await this.getErrorMessage();
    expect(actualMessage).toContain(expectedMessage);
  }
}
