import { defineConfig } from "tinacms";

const branch = process.env.HEAD || process.env.BRANCH || "main";

export default defineConfig({
  branch,
  clientId: process.env.TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  build: {
    outputFolder: "admin",
    publicFolder: "src",
  },
  media: {
    tina: {
      mediaRoot: "images/uploads",
      publicFolder: "src",
    },
  },
  schema: {
    collections: [
      {
        name: "post",
        label: "Blog Posts",
        path: "src/blog/posts",
        format: "md",
        ui: {
          filename: {
            slugify: (values) =>
              (values?.slug || values?.title || "untitled")
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, ""),
          },
        },
        fields: [
          { type: "string", name: "title", label: "Title", isTitle: true, required: true },
          { type: "string", name: "slug", label: "URL Slug", description: "Controls the URL: /blog/<slug>/" },
          { type: "datetime", name: "date", label: "Publish Date", required: true },
          { type: "string", name: "description", label: "Meta Description", ui: { component: "textarea" }, description: "150–160 characters, shown in Google search results" },
          { type: "string", name: "canonicalURL", label: "Canonical URL", description: "Only set if this content is republished from elsewhere" },
          { type: "image", name: "image", label: "Cover / Social Image", description: "Used as the article hero and the social share (og:image) preview" },
          { type: "string", name: "author", label: "Author" },
          { type: "rich-text", name: "body", label: "Body", isBody: true },
        ],
      },
    ],
  },
});
