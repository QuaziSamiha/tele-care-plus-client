"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { blogData } from "../data/home.data";

export default function HomeBlogs() {
  const t = useTranslations("Home.blogs");
  return (
    <section className="bg-neutral-100 py-14">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full flex flex-col gap-2.5 justify-center items-center">
          <p className="text-lg text-slate-500 font-medium text-center">
            {t("eyebrow")}
          </p>
          <div className="text-center text-slate-800 font-semibold max-md:text-3xl md:text-4xl xl:text-5xl">
            <p>{t("titleTop")}</p>
            <p>{t("titleBottom")}</p>
          </div>
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8 w-full">
            {blogData.map((blog, index) => (
              <Link key={index} href="">
                {" "}
                <div className="w-full flex flex-col gap-5">
                  <div className="w-full">
                    {index % 2 === 0 ? (
                      <Image
                        src={blog.imageSrc}
                        alt=""
                        width={366}
                        height={268}
                        className="w-full h-[268px] object-cover"
                      />
                    ) : (
                      <Image
                        src={blog.imageSrc}
                        alt=""
                        width={366}
                        height={380}
                        className="w-full h-[380px] object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    <p className="text-slate-600">{blog.blogCategory}</p>
                    <p className="line-clamp-3 text-slate-800 text-2xl font-medium">
                      {blog.title}
                    </p>
                    <div className="flex items-center gap-1 text-slate-400 text-sm">
                      <p>{blog.date}</p>
                      <span>.</span>
                      <p className="">
                        {blog.totalComments > 0
                          ? t("comments", { count: blog.totalComments })
                          : t("noComments")}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </section>
        </div>
      </main>
    </section>
  );
}
