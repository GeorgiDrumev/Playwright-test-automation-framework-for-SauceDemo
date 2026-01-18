import { test } from "@/fixtures/base-ui-test";
import { expectedProducts } from "@data/test-data/product-data";
import { checkoutInformation } from "@data/test-data/checkout-data";

test.describe("Checkout Details Page Visual Tests", () => {
  test.beforeEach(async ({ loginPage, productsPage, cartPage }) => {
    await loginPage.goto();
    await loginPage.login();
    await productsPage.verifyPageLoaded();
  });

  test(
    "should match checkout details page with single item",
    { tag: ["@checkout", "@visual"] },
    async ({
      productsPage,
      cartPage,
      checkoutUserInformationPage,
      checkoutDetailsPage,
    }) => {
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
      await checkoutDetailsPage.compareScreenshot(
        "checkout-details-page-single-item",
      );
    },
  );

  test(
    "should match checkout details page with multiple items",
    { tag: ["@checkout", "@visual"] },
    async ({
      productsPage,
      cartPage,
      checkoutUserInformationPage,
      checkoutDetailsPage,
    }) => {
      await productsPage.addProductToCart(expectedProducts[0].name);
      await productsPage.addProductToCart(expectedProducts[1].name);
      await productsPage.addProductToCart(expectedProducts[2].name);
      await productsPage.navigateToCart();
      await cartPage.verifyPageLoaded();
      await cartPage.clickCheckout();
      await checkoutUserInformationPage.verifyPageLoaded();
      await checkoutUserInformationPage.fillCheckoutInformation(
        checkoutInformation.validInfo,
      );
      await checkoutUserInformationPage.clickContinue();
      await checkoutDetailsPage.verifyPageLoaded();
      await checkoutDetailsPage.compareScreenshot(
        "checkout-details-page-multiple-items",
      );
    },
  );
});
