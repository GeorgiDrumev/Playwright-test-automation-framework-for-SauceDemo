import { Page, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

export interface ScreenshotConfig {
  retryCount?: number;
  retryDelay?: number;
  deviation?: number;
  screenshotDir?: string;
  fullPage?: boolean;
}

export class ScreenshotService {
  private static readonly DEFAULT_RETRY_COUNT = 5;
  private static readonly DEFAULT_RETRY_DELAY = 2000;
  private static readonly DEFAULT_DEVIATION = 0.001;
  private static readonly DEFAULT_SCREENSHOT_DIR = "data/screenshots";
  private static readonly DEFAULT_FULL_PAGE = true;

  private page: Page;
  private config: Required<ScreenshotConfig>;

  constructor(page: Page, config?: ScreenshotConfig) {
    this.page = page;
    this.config = {
      retryCount: config?.retryCount ?? ScreenshotService.DEFAULT_RETRY_COUNT,
      retryDelay: config?.retryDelay ?? ScreenshotService.DEFAULT_RETRY_DELAY,
      deviation: config?.deviation ?? ScreenshotService.DEFAULT_DEVIATION,
      screenshotDir:
        config?.screenshotDir ?? ScreenshotService.DEFAULT_SCREENSHOT_DIR,
      fullPage: config?.fullPage ?? ScreenshotService.DEFAULT_FULL_PAGE,
    };
  }

  public async compareScreenshot(
    name: string,
    pageName: string,
    deviation?: number,
  ): Promise<void> {
    const threshold = deviation ?? this.config.deviation;

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.config.retryCount; attempt++) {
      try {
        await this.waitForPageStabilization();

        await expect(this.page).toHaveScreenshot(`${pageName}/${name}.png`, {
          threshold,
          maxDiffPixels: 100,
          fullPage: this.config.fullPage,
        });

        return;
      } catch (error) {
        lastError = error as Error;

        if (attempt < this.config.retryCount) {
          await this.page.waitForTimeout(this.config.retryDelay);
        }
      }
    }

    throw new Error(
      `Screenshot comparison failed after ${this.config.retryCount} attempts: ${lastError?.message}`,
    );
  }

  private async waitForPageStabilization(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(500);
    await this.page.evaluate(() => document.fonts.ready);
  }

  private getScreenshotPath(pageName: string): string {
    return path.join(this.config.screenshotDir, pageName);
  }

  private ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }
}
