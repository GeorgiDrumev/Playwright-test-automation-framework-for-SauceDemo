import { test } from "@/fixtures/base-ui-test";
import { INVALID_PRODUCT_ID } from "@data/test-data/product-data";

test.describe("Products Edge Cases", () => {
  test(
    "should handle direct navigation to products without authentication",
    { tag: ["@products", "@edge-case"] },
    async ({ productsPage, loginPage }) => {
      await productsPage.goto();

      await loginPage.verifyPageLoaded();
    },
  );

  test(
    "should redirect to login when accessing product details without authentication",
    { tag: ["@products", "@edge-case"] },
    async ({ productDetailsPage, loginPage }) => {
      await productDetailsPage.goto(4);

      await loginPage.verifyPageLoaded();
    },
  );

  test(
    "should handle invalid product ID in URL",
    { tag: ["@products", "@edge-case", "@known-issue"] },
    async ({ loginPage, productDetailsPage, productsPage }) => {
      await loginPage.goto();
      await loginPage.login();
      await productsPage.verifyPageLoaded();

      await productDetailsPage.goto(INVALID_PRODUCT_ID);

      await productDetailsPage.verifyPageNotLoaded();
    },
  );
});
