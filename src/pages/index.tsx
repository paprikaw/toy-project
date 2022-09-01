import { createSSGHelpers } from '@trpc/react/ssg';
import { InferGetStaticPropsType } from 'next';
import { createContext } from '../server/router/context';
import { appRouter } from "../server/router";
import DateFormatter from '../components/date-formatter';
import { useRouter } from 'next/router';
import DarkModeToggle from '@components/dark-mode-toggle';




const Home = ({ posts }: InferGetStaticPropsType<typeof getStaticProps>) => {

  return (
    <div className="min-h-screen duration-100 dark:bg-slate-800 dark:duration-100">
      <div className="mx-auto max-w-xl pt-10 pb-28 px-5">
        <div className='flex justify-between items-center mb-10'>
          <div className="text-4xl dark:text-white font-extrabold relative ">{"Xu's blog"}</div>
          <DarkModeToggle />
        </div>
        <div className="grow flex flex-col gap-10 h-full items-center">
          {posts && posts.map((({ meta }, index) => (<BlogContent key={index} title={meta.title} time={meta.date} excerpt={meta.excerpt} slug={meta.slug} />))
          )}
        </div>
      </div>
    </div >
  );
};


type blogProps = {
  title?: string,
  time: string,
  excerpt?: string,
  slug?: string,
}

const BlogContent = (props: blogProps) => {
  const { title, time, excerpt, slug } = props
  const router = useRouter();
  return (
    <div
      className=" flex flex-col max-w-xl w-full  hover:cursor-pointer "
      onClick={() => {
        router.push(`posts/${slug}`)
      }}>
      <div className="flex flex-col justify-between">
        <div className="text-3xl text-indigo-700 dark:text-blue-400 font-bold capitalize truncate mb-2">{title}</div> <div className="dark:text-white text-xs">
          <DateFormatter dateString={time} />
        </div>
      </div>
      <div className="dark:text-white text-lg">{excerpt}</div>
    </div>
  )
}

export async function getStaticProps() {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: await createContext(),
  });
  /*
   * Prefetching the `blog.all` query here.
   * `prefetchQuery` does not return the result - if you need that, use `fetchQuery` instead.
   */
  const posts = await ssg.fetchQuery('blog.all');
  return {
    props: { posts },
  }
}

export default Home;
