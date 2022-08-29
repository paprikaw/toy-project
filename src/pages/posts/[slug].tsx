import { createSSGHelpers } from '@trpc/react/ssg';
import { createContext } from '@server/router/context';
import { appRouter } from '@server/router';
import { getSlugs, PostMeta } from '@server/router/utils';
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemoteSerializeResult } from 'next-mdx-remote';

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
  const mdxSource = await serialize(content);
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
      <div className="grow-0 flex flex-col items-center text-white p-20 justify-between gap-10 bg-slate-600">
        <div className="text-4xl ">{post.meta.title}</div>
      </div>
    </div >
  );
};
export default postDetail;
