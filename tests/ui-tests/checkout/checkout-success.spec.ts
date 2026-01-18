import { test } from "@/fixtures/base-ui-test";
import { checkoutInformation } from "@data/test-data/checkout-data";
import { expectedProducts } from "@data/test-data/product-data";

test.describe("Checkout Success Tests", () => {
  test.beforeEach(
    async ({
      loginPage,
      productsPage,
      cartPage,
      checkoutUserInformationPage,
      checkoutDetailsPage,
    }) => {
      await loginPage.goto();
      await loginPage.login();
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
    },
  );

  test(
    "should display order complete message",
    { tag: ["@checkout", "@positive"] },
    async ({ checkoutSuccessPage }) => {
      await checkoutSuccessPage.verifyPageLoaded();
      await checkoutSuccessPage.verifyOrderComplete();
    },
  );

  test(
    "should navigate back to products page",
    { tag: ["@checkout", "@positive"] },
    async ({ checkoutSuccessPage, productsPage }) => {
      await checkoutSuccessPage.verifyPageLoaded();

      await checkoutSuccessPage.clickBackHome();

      await productsPage.verifyPageLoaded();
    },
  );
});
