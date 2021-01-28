module.exports = {
  preset: "jest-puppeteer",
  testMatch: ["**/specs/*.ts"],
  transform: {
    "\\.js$": "react-scripts/config/jest/babelTransform",
  },
  verbose: true,
};
