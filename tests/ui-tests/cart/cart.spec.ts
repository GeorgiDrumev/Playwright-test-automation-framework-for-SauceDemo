import { test } from "@/fixtures/base-ui-test";
import { expectedProducts } from "@data/test-data/product-data";

test.describe("Cart Tests", () => {
  test.beforeEach(async ({ loginPage, productsPage }) => {
    await loginPage.goto();
    await loginPage.login();
    await productsPage.verifyPageLoaded();
  });

  test(
    "should display empty cart initially",
    { tag: ["@cart", "@positive"] },
    async ({ productsPage, cartPage }) => {
      await productsPage.navigateToCart();
      await cartPage.verifyPageLoaded();
      await cartPage.verifyCartIsEmpty();
    },
  );

  test(
    "should display products added to cart",
    { tag: ["@cart", "@positive"] },
    async ({ productsPage, cartPage }) => {
      const product1 = expectedProducts[0].name;
      const product2 = expectedProducts[1].name;

      await productsPage.addProductToCart(product1);
      await productsPage.addProductToCart(product2);
      await productsPage.navigateToCart();

      await cartPage.verifyProductsInCart([product1, product2]);
      await cartPage.verifyCartItemCount(2);
    },
  );

  test(
    "should remove product from cart",
    { tag: ["@cart", "@positive"] },
    async ({ productsPage, cartPage }) => {
      const product = expectedProducts[0].name;

      await productsPage.addProductToCart(product);
      await productsPage.navigateToCart();
      await cartPage.verifyProductInCart(product);

      await cartPage.removeItemByName(product);
      await cartPage.verifyCartIsEmpty();
    },
  );

  test(
    "should remove multiple products from cart",
    { tag: ["@cart", "@positive"] },
    async ({ productsPage, cartPage }) => {
      await productsPage.addProductToCart(expectedProducts[0].name);
      await productsPage.addProductToCart(expectedProducts[1].name);
      await productsPage.addProductToCart(expectedProducts[2].name);
      await productsPage.navigateToCart();

      await cartPage.verifyCartItemCount(3);

      await cartPage.removeItemByIndex(0);
      await cartPage.verifyCartItemCount(2);

      await cartPage.removeItemByIndex(0);
      await cartPage.verifyCartItemCount(1);

      await cartPage.removeItemByIndex(0);
      await cartPage.verifyCartIsEmpty();
    },
  );

  test(
    "should navigate back to products page via Continue Shopping",
    { tag: ["@cart", "@positive"] },
    async ({ productsPage, cartPage }) => {
      await productsPage.navigateToCart();
      await cartPage.verifyPageLoaded();

      await cartPage.clickContinueShopping();
      await productsPage.verifyPageLoaded();
    },
  );

  test(
    "should navigate to checkout page",
    { tag: ["@cart", "@positive"] },
    async ({ productsPage, cartPage, checkoutUserInformationPage }) => {
      await productsPage.addProductToCart(expectedProducts[0].name);
      await productsPage.navigateToCart();

      await cartPage.clickCheckout();
      await checkoutUserInformationPage.verifyPageLoaded();
    },
  );

  test(
    "should navigate to product details page when clicking item",
    { tag: ["@cart", "@positive", "@known-issue"] },
    async ({ productsPage, cartPage, productDetailsPage }) => {
      const product = expectedProducts[0];

      await productsPage.addProductToCart(product.name);
      await productsPage.navigateToCart();
      await cartPage.verifyPageLoaded();

      await cartPage.clickItemByName(product.name);
      await productDetailsPage.verifyProductDetails(product);

      await productDetailsPage.clickBackButton();
      await cartPage.verifyPageLoaded();
    },
  );
});
