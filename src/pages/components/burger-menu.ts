import { Page, Locator, expect } from "@playwright/test";

export class BurgerMenu {
  readonly page: Page;
  readonly menuButton: Locator;
  readonly closeButton: Locator;
  readonly allItemsLink: Locator;
  readonly aboutLink: Locator;
  readonly logoutLink: Locator;
  readonly resetAppLink: Locator;
  readonly menuOverlay: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuButton = page.locator("#react-burger-menu-btn");
    this.closeButton = page.locator("#react-burger-cross-btn");
    this.allItemsLink = page.locator('[data-test="inventory-sidebar-link"]');
    this.aboutLink = page.locator('[data-test="about-sidebar-link"]');
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
    this.resetAppLink = page.locator('[data-test="reset-sidebar-link"]');
    this.menuOverlay = page.locator(".bm-overlay");
  }

  public async open() {
    await this.menuButton.click();
    await this.allItemsLink.waitFor({ state: "visible" });
  }

  public async close() {
    await this.closeButton.click();
  }

  public async clickAllItems() {
    await this.allItemsLink.click();
  }

  public async clickAbout() {
    await this.aboutLink.click();
  }

  public async clickLogout() {
    await this.logoutLink.click();
  }

  public async clickResetApp() {
    await this.resetAppLink.click();
  }

  public async isMenuOpen(): Promise<boolean> {
    return await this.closeButton.isVisible();
  }

  public async verifyMenuIsOpen() {
    await expect(this.closeButton).toBeVisible();
    await expect(this.allItemsLink).toBeVisible();
    await expect(this.logoutLink).toBeVisible();
  }

  public async verifyMenuIsClosed() {
    await expect(this.closeButton).not.toBeVisible();
  }

  public async verifyAllMenuItemsVisible() {
    await expect(this.allItemsLink).toBeVisible();
    await expect(this.aboutLink).toBeVisible();
    await expect(this.logoutLink).toBeVisible();
    await expect(this.resetAppLink).toBeVisible();
  }
}
