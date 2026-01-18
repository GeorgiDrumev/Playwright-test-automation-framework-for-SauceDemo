import { test } from "@/fixtures/base-ui-test";
import { expectedProducts } from "@data/test-data/product-data";

test.describe("Checkout User Information Page Visual Tests", () => {
  test.beforeEach(async ({ loginPage, productsPage, cartPage }) => {
    await loginPage.goto();
    await loginPage.login();
    await productsPage.verifyPageLoaded();
    await productsPage.addProductToCart(expectedProducts[0].name);
    await productsPage.clickCartIcon();
    await cartPage.verifyPageLoaded();
    await cartPage.clickCheckout();
  });

  test(
    "should match checkout user information page",
    { tag: ["@checkout", "@visual"] },
    async ({ checkoutUserInformationPage }) => {
      await checkoutUserInformationPage.verifyPageLoaded();
      await checkoutUserInformationPage.compareScreenshot(
        "checkout-user-information-page",
      );
    },
  );
});
