import { test } from "@/fixtures/base-ui-test";

test.describe("Burger Menu Tests", () => {
  test.beforeEach(async ({ loginPage, productsPage }) => {
    await loginPage.goto();
    await loginPage.login();
    await productsPage.verifyPageLoaded();
  });

  test(
    "should open burger menu",
    { tag: ["@navigation", "@positive"] },
    async ({ productsPage }) => {
      await productsPage.burgerMenu.open();
      await productsPage.burgerMenu.verifyMenuIsOpen();
      await productsPage.burgerMenu.verifyAllMenuItemsVisible();
    },
  );

  test(
    "should close burger menu with X button",
    { tag: ["@navigation", "@positive"] },
    async ({ productsPage }) => {
      await productsPage.burgerMenu.open();
      await productsPage.burgerMenu.verifyMenuIsOpen();

      await productsPage.burgerMenu.close();
      await productsPage.burgerMenu.verifyMenuIsClosed();
    },
  );

  test(
    "should navigate to All Items",
    { tag: ["@navigation", "@positive"] },
    async ({ productsPage }) => {
      await productsPage.clickProductByIndex(0);

      await productsPage.burgerMenu.open();
      await productsPage.burgerMenu.clickAllItems();

      await productsPage.verifyPageLoaded();
    },
  );

  test(
    "should navigate to About page",
    { tag: ["@navigation", "@positive"] },
    async ({ productsPage, page }) => {
      await productsPage.burgerMenu.open();
      await productsPage.burgerMenu.clickAbout();

      await page.waitForURL(/saucelabs\.com/);
    },
  );

  test(
    "should reset app state",
    { tag: ["@navigation", "@positive"] },
    async ({ productsPage }) => {
      await productsPage.addProductToCart("Sauce Labs Backpack");
      await productsPage.verifyCartBadgeCount("1");

      await productsPage.burgerMenu.open();
      await productsPage.burgerMenu.clickResetApp();
      await productsPage.burgerMenu.close();

      await productsPage.verifyCartBadgeNotVisible();
    },
  );

  test(
    "should navigate from cart to products page via All Items",
    { tag: ["@navigation", "@positive"] },
    async ({ productsPage, cartPage }) => {
      await productsPage.addProductToCart("Sauce Labs Backpack");
      await productsPage.clickCartIcon();
      await cartPage.verifyPageLoaded();

      await cartPage.burgerMenu.open();
      await cartPage.burgerMenu.clickAllItems();

      await productsPage.verifyPageLoaded();
    },
  );
});
