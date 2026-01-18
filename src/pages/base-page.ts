import { Page } from "@playwright/test";
import {
  ScreenshotService,
  ScreenshotConfig,
} from "../services/screenshot-service";

export abstract class BasePage {
  readonly page: Page;
  abstract readonly url: string;
  abstract readonly screenshotFolder: string;
  private screenshotService: ScreenshotService;

  constructor(page: Page, screenshotConfig?: ScreenshotConfig) {
    this.page = page;
    this.screenshotService = new ScreenshotService(page, screenshotConfig);
  }

  public async goto() {
    await this.page.goto(this.url);
  }

  public async compareScreenshot(
    name: string,
    deviation?: number,
  ): Promise<void> {
    await this.screenshotService.compareScreenshot(
      name,
      this.screenshotFolder,
      deviation,
    );
  }
}
