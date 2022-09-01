import { createSSGHelpers } from '@trpc/react/ssg';
import { InferGetStaticPropsType } from 'next';
import { createContext } from '../server/router/context';
import { appRouter } from "../server/router";
import DateFormatter from '../components/date-formatter';
import { useRouter } from 'next/router';
import DarkModeToggle from '@components/dark-mode-toggle';




const Home = ({ posts }: InferGetStaticPropsType<typeof getStaticProps>) => {

  // // Get the dark mode from localstorage
  // let darkMode = (typeof window !== 'undefined') && localStorage.getItem('darkMode') === 'true';

  // // Setting the current theme
  // if (typeof window !== 'undefined') {
  //   toggleDarkMode(darkMode);
  // }

  // // When the user clicks the dark mode toggle, update the localStorage and set the state
  // const onDarkModeClick = () => {
  //   if (typeof window !== 'undefined') {
  //     if (!darkMode) {
  //       console.log('light');
  //       localStorage.setItem('darkMode', 'true');
  //       toggleDarkMode(!darkMode);
  //       darkMode = true;
  //     } else {
  //       console.log('dark');
  //       localStorage.setItem('darkMode', 'false');
  //       toggleDarkMode(!darkMode);
  //       darkMode = false;
  //     }
  //   }
  // }


  return (
    <div className="min-h-screen duration-100 dark:bg-slate-700 dark:duration-100">
      <div className="mx-auto md:max-w-3xl md:mx-auto lg:max-w-xl lg:pt-20 lg:pb-28">
        <div className='flex justify-between items-center mb-10'>
          <div className="text-4xl dark:font-white font-extrabold relative ">{"Xu's blog"}</div>
          {/* <DarkModeToggle onClick={onDarkModeClick} isDarkMode={darkMode} /> */}
          <DarkModeToggle />
        </div>
        <div className="grow flex flex-col gap-10 h-full items-center">
          {posts && posts.map((({ meta }, index) => (<BlogContent key={index} title={meta.title} time={meta.date} intro={meta.excerpt} slug={meta.slug} />))
          )}
        </div>
      </div>
    </div >
  );
};


type blogProps = {
  title?: string,
  time: string,
  intro?: string,
  slug?: string,
}

const BlogContent = (props: blogProps) => {
  const { title, time, intro, slug } = props
  const router = useRouter();
  return (
    <div
      className=" flex flex-col max-w-xl w-full  hover:cursor-pointer "
      onClick={() => {
        router.push(`posts/${slug}`)
      }}>
      <div className="flex flex-col justify-between">
        <div className="text-3xl text-indigo-700 dark:text-white font-bold capitalize max-w-xs truncate">{title}</div>
        <div className="text-gray-400">
          <DateFormatter dateString={time} />
        </div>
      </div>
      <div className="text-gray-500">{intro}</div>
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

// set dark mode based on isDarkMode query param
// const toggleDarkMode = (isDarkMode: boolean) => {
//   if (isDarkMode) {
//     document.documentElement.classList.add('dark');
//   } else {
//     document.documentElement.classList.remove('dark');
//   }
// }
export default Home;
