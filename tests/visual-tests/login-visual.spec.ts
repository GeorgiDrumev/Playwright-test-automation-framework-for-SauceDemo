import { test } from "@/fixtures/base-ui-test";

test.describe("Login Page Visual Tests", () => {
  test(
    "should match login page",
    { tag: ["@authentication", "@visual"] },
    async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.compareScreenshot("login-page");
    },
  );

  test(
    "should match login page with error",
    { tag: ["@authentication", "@visual"] },
    async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.login("invalid_user", "invalid_password");
      await loginPage.compareScreenshot("login-page-with-error");
    },
  );
});
