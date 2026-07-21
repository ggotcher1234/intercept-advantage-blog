module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/styles");
  eleventyConfig.addPassthroughCopy("src/images");

  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/blog/posts/*.md").sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addFilter("date", function (dateObj, format) {
    const d = new Date(dateObj);
    const pad = (n) => String(n).padStart(2, "0");
    if (format === "yyyy-MM-dd") return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
    if (format === "yyyy") return String(d.getUTCFullYear());
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
  });

  eleventyConfig.addShortcode("year", () => new Date().getFullYear());

  return {
    dir: { input: "src", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
