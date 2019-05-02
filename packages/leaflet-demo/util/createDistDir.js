/**
 * Ensures the distination directory exists and is empty.
 */
import { emptyDir, ensureDir } from "fs-extra";

const distPath = "./dist";

(async () => {
  try {
    await ensureDir(distPath);
    await emptyDir(distPath);
  } catch (ex) {
    console.error(ex);
  }
})();
