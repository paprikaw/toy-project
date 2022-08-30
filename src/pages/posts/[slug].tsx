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

const postDetail = ({ post }: { post: MDXpost }) => {

  return (
    <div className="min-h-screen flex flex-col">
      <div className='prose  relative w-full px-12 py-12 bg-white shadow-xl shadow-slate-700/10 ring-1 ring-gray-900/5 md:max-w-3xl md:mx-auto lg:max-w-4xl lg:pt-20 lg:pb-28'>
        <h1>{post.meta.title}</h1>
        <MDXRemote {...post.source} />
      </div>
    </div >
  );
};
export default postDetail;
