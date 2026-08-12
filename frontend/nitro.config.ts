import { defineNitroConfig } from "nitro/config";

export default defineNitroConfig({
  prerender: {
    routes: ["/", "/login", "/register", "/dashboard"],
    crawlLinks: true,
  },
});
