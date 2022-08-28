import { createSSGHelpers } from '@trpc/react/ssg';
import { InferGetServerSidePropsType } from 'next';
import { createContext } from '../server/router/context';
import { appRouter } from "../server/router";
import { PostType } from '../interface/blog';
import DateFormatter from '../components/date-formatter';
import { useRouter } from 'next/router';
type Props = {
  allPosts: PostType[]
}
const Home = ({ blogs }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="grow-0 flex flex-col items-center text-white p-20 justify-between gap-10 bg-slate-600">
        <div className="text-4xl ">{"Xu's blog"}</div>
      </div>
      <div className=" grow flex flex-col items-center p-20 2  gap-10 bg-slate-300 h-full">
        {blogs[0] && blogs.map((({ time, title, intro, slug }, index) => (<BlogCard key={index} title={title} time={time} intro={intro} slug={slug} />))
        )}
      </div>
    </div >
  );
};


type blogProps = {
  title?: string,
  time?: string,
  intro?: string,
  slug?: string,
}
const BlogCard = (props: blogProps) => {
  const { title, time, intro, slug } = props
  const router = useRouter();
  return (
    <div className=" flex flex-col hover:shadow-xl bg-white p-5 max-w-xl w-full  hover:cursor-pointer" onClick={(e) => {
      router.push(`posts/${slug}`)
    }}>
      <div className="flex justify-between">
        <div className="text-xl capitalize max-w-xs truncate">{title}</div>
        <div className="text-gray-400">
          <DateFormatter dateString={time} />
        </div>
      </div>
      <div className="text-gray-500">{intro}</div>
    </div>
  )
}

export async function getServerSideProps() {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: await createContext(),
  });
  /*
   * Prefetching the `post.byId` query here.
   * `prefetchQuery` does not return the result - if you need that, use `fetchQuery` instead.
   */
  const blogs = await ssg.fetchQuery('blog.all');
  return {
    props: { blogs },
  }
}

export default Home;
