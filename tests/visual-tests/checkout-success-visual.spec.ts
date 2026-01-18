import { test } from "@/fixtures/base-ui-test";
import { expectedProducts } from "@data/test-data/product-data";
import { checkoutInformation } from "@data/test-data/checkout-data";

test.describe("Checkout Success Page Visual Tests", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login();
  });

  test(
    "should match checkout success page",
    { tag: ["@checkout", "@visual"] },
    async ({
      productsPage,
      cartPage,
      checkoutUserInformationPage,
      checkoutDetailsPage,
      checkoutSuccessPage,
    }) => {
      await productsPage.verifyPageLoaded();
      await productsPage.addProductToCart(expectedProducts[0].name);
      await productsPage.navigateToCart();
      await cartPage.verifyPageLoaded();
      await cartPage.clickCheckout();
      await checkoutUserInformationPage.verifyPageLoaded();
      await checkoutUserInformationPage.fillCheckoutInformation(
        checkoutInformation.validInfo,
      );
      await checkoutUserInformationPage.clickContinue();
      await checkoutDetailsPage.verifyPageLoaded();
      await checkoutDetailsPage.clickFinish();
      await checkoutSuccessPage.verifyPageLoaded();
      await checkoutSuccessPage.compareScreenshot("checkout-success-page");
    },
  );
});
