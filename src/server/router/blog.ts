import { createRouter } from "./context";
import { z } from "zod";
import { getAllPosts, getPostFromSlug } from "@server/router/utils";

export const blogRouter = createRouter()
  .query("all", {
    resolve() {
      return getAllPosts();
    },
  })
  .query("post", {
    input: z.string(),
    async resolve({ input }) {
      const post = getPostFromSlug(input);
      return {
        post,
      };
    },
  });