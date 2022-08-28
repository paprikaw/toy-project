import { createRouter } from "./context";
import { z } from "zod";
import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import markdownToHtml from "@utils/markdownToHtml";
const postsDirectory = join(process.cwd(), '_posts')

export function getPostBySlug(slug: string, fields: string[]) {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = join(postsDirectory, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  

  const {data, content} = matter(fileContents);
  type Items = {
    [key: string]: string
  }

  const items:Items = {}// Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = realSlug
    }
    if (field === 'content') {
      items[field] = content
    }

    if (typeof data[field] !== 'undefined') {
      items[field] = data[field]
    }
  })
  return items
}
// Must have "time" as a field, otherwise the sorting will not work
export function getAllPosts(fields: string[] = []) {

  const slugs = fs.readdirSync(postsDirectory);
  if (fields.includes('time')) {
    return slugs
    .map((slug) => {
      const schema = z.object({time: z.string()});
      return schema.passthrough().parse(getPostBySlug(slug, fields));
    })
    // sort posts by date in descending order
    .sort((post1, post2) => ( post1.time > post2.time ? -1 : 1));
  } else {
    return slugs
    .map((slug) => {
      return getPostBySlug(slug, fields);
    })
  }
}

export const blogRouter = createRouter()
  .query("all", {
    async resolve() {
      const blogs = getAllPosts(['title', 'time', 'intro', 'slug']);
      return blogs;
    },
  })
  .query("post", {
    input: z.string(),
    async resolve({input}) {
      const postSchema = z.object({
        title: z.string(),
        time: z.string(),
        intro: z.string(),
        content: z.string(),
      })

      const post = postSchema.parse(
        getPostBySlug(input, [ 
          'title',
          'time',
          'intro',
          'content',
        ])
      );

      const content = await markdownToHtml(post.content || '')
      return {
        post: {
          ...post,
          content,
        },
      }
    },
  });