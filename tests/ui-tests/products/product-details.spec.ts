import { test } from "@/fixtures/base-ui-test";
import { expectedProducts } from "@data/test-data/product-data";

test.describe("Product Details Tests", () => {
  test.beforeEach(async ({ loginPage, productsPage }) => {
    await loginPage.goto();
    await loginPage.login();
    await productsPage.verifyPageLoaded();
  });

  test(
    "should display correct product details when clicking on product",
    { tag: ["@products", "@positive"] },
    async ({ productsPage, productDetailsPage }) => {
      const expectedProduct = expectedProducts[0];

      await productsPage.clickProductName(expectedProduct.name);
      await productDetailsPage.verifyProductDetails(expectedProduct);
    },
  );

  test(
    "should add product to cart from details page",
    { tag: ["@products", "@positive"] },
    async ({ productsPage, productDetailsPage }) => {
      const product = expectedProducts[0];

      await productsPage.clickProductName(product.name);
      await productDetailsPage.addToCart();
      await productDetailsPage.verifyProductIsInCart();
    },
  );

  test(
    "should navigate back to products page",
    { tag: ["@products", "@positive"] },
    async ({ productsPage, productDetailsPage }) => {
      const product = expectedProducts[0];

      await productsPage.clickProductName(product.name);
      await productDetailsPage.clickBackButton();
      await productsPage.verifyPageLoaded();
    },
  );

  test(
    "should remove product from cart on details page",
    { tag: ["@products", "@positive"] },
    async ({ productsPage, productDetailsPage }) => {
      const product = expectedProducts[0];

      await productsPage.clickProductName(product.name);
      await productDetailsPage.addToCart();
      await productDetailsPage.verifyProductIsInCart();

      await productDetailsPage.removeFromCart();
      await productDetailsPage.verifyProductNotInCart();
    },
  );
});
