import { onReady } from "@xatom/core";
import { app } from "./routes";

onReady(() => {
  global();

  app();
});

/**
 * Code that runs on all pages
 */
function global(): void {}
