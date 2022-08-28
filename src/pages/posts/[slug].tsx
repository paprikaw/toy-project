import { createSSGHelpers } from '@trpc/react/ssg';
import { createContext } from '@server/router/context';
import { appRouter } from '@server/router';
import { getAllPosts } from '@server/router/blog';
import PostBody from '@components/post-body';




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
  return {
    props: {
      post: post
    },
  }
}

// Get page path
export const getStaticPaths = async () => {
  const posts = getAllPosts(['slug'])
  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      }
    }),
    fallback: false,
  }
}

type Props = {
  post: {
    title: string,
    content: string
  }
}
const postDetail = ({ post }: Props) => {

  return (
    <div className="min-h-screen flex flex-col">
      <div className="grow-0 flex flex-col items-center text-white p-20 justify-between gap-10 bg-slate-600">
        <div className="text-4xl ">{post.title}</div>
      </div>
      <article>
        <PostBody content={post.content} />
      </article>
    </div >
  );
};
export default postDetail;
