const { join } = require("path");

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Changes the cache location for Puppeteer to be inside the app directory
  // This ensures it persists in /home/site/wwwroot on Azure
  cacheDirectory: join(__dirname, ".cache", "puppeteer"),
};
