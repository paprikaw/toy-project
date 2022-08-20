import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {

  return (
    <>
      <div className="flex flex-col items-center text-white p-20 justify-between gap-10 bg-slate-600">
        <div className="text-4xl ">{"Xu's blog"}</div>
        <div className="flex justify-around gap-5 ">
          <div>github</div>
          <div>|</div>
          <div>email</div>
          <div>|</div>
          <div>zhihu</div>
        </div>
      </div>
      <div className="flex flex-col items-center p-20 justify-between gap-10">
        <div >Content area</div>
      </div>
    </>
  );
};

export default Home;
