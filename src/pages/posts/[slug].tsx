import { createSSGHelpers } from '@trpc/react/ssg';
import { createContext } from '@server/router/context';
import { appRouter } from '@server/router';
import { getSlugs, PostMeta } from '@server/router/utils';
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import rehypeHighlight from 'rehype-highlight'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import "highlight.js/styles/atom-one-dark.css";
import DarkModeToggle from '@components/dark-mode-toggle';
import { useRouter } from 'next/router';
type Params = {
  params: {
    slug: string
  }
}

export const getStaticProps = async ({ params }: Params) => {

  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: await createContext(),
  });

  /*
   * Prefetching the `post.byId` query here.
   * `prefetchQuery` does not return the result - if you need that, use `fetchQuery` instead.
   */
  const { post } = await ssg.fetchQuery('blog.post', params.slug);
  const { content, meta } = post;
  const mdxSource = await serialize(
    content,
    {
      mdxOptions: {
        rehypePlugins: [rehypeSlug, rehypeHighlight, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
      },
    }
  );

  return {
    props: {
      post: { meta, source: mdxSource },
    },
  }
}

// Get page path
export const getStaticPaths = async () => {
  const slugs = getSlugs();
  return {
    paths: slugs.map((slug) => {
      return {
        params: {
          slug
        },
      }
    }),
    fallback: false,
  }
}

type MDXpost = {
  source: MDXRemoteSerializeResult<Record<string, unknown>, Record<string, string>>,
  meta: PostMeta
}

const PostDetail = ({ post }: { post: MDXpost }) => {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col dark:bg-slate-800 duration-100">
      <div className='prose dark:prose-invert dark:bg-slate-800  duration-100 relative w-full px-12 py-12 bg-white shadow-xl shadow-slate-700/10 ring-1 ring-gray-900/5 md:max-w-3xl md:mx-auto lg:max-w-4xl lg:pt-10 lg:pb-28 '>
        <div className='flex justify-between items-center mb-10'>
          <div
            className="text-2xl  dark:text-white font-extrabold relative hover:cursor-pointer"
            onClick={() => {
              router.push(`/`)
            }}
          >
            {"Xu's Blog"}</div>
          <DarkModeToggle />
        </div>
        <h1 className='dark:text-blue-400 text-indigo-800'>{post.meta.title}</h1>
        <MDXRemote {...post.source} />
      </div>
    </div >
  );
};
export default PostDetail;
