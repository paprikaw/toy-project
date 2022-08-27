import { createSSGHelpers } from '@trpc/react/ssg';
import { InferGetServerSidePropsType } from 'next';
import { createContext } from '@server/router/context';
import { appRouter } from '@server/router';
import { PostType } from '@interface/blog';
import { useRouter } from 'next/router';
import { getAllPosts, getPostBySlug } from '@server/router/blog';
import markdownToHtml from "@utils/markdownToHtml";
import PostBody from '@components/post-body';
import markdownStyles from './markdown-styles.module.css';
type Props = {
  post: PostType
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



type Params = {
  params: {
    slug: string
  }
}

export async function getStaticProps({ params }: Params) {

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
export async function getStaticPaths() {
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

export default postDetail;
