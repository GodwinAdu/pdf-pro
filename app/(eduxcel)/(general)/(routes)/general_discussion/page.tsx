import React from "react";
import ThreadCard from "@/components/general-discussion/cards/ThreadCard";
import Pagination from "@/components/general-discussion/shared/Pagination";
import { fetchPosts } from "@/lib/actions/thread.actions";
import { currentUser } from "@/lib/helpers/current-user";
export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await currentUser();
  //    if (!user) return null;

  //   // fetch organization list created by user
  //   const userInfo = await fetchUser(user.id);
  //   if (!userInfo?.onboarded) redirect("/onboarding"); 

  const result = await fetchPosts(1, 30)


  return (
    <>
      <h1 className="text-2xl text-foreground font-bold">Home</h1>

      <section className="mt-9 flex flex-col gap-10 overflow-auto">
        {result.posts.length === 0 ? (
          <p className="no-result">
            No threads found
          </p>
        ) : (
          <>
            {result.posts.map((post) => (
              <ThreadCard
                key={post?._id}
                thread={post}
                id={post?._id}
                currentUserId={user?._id}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                createdAt={post.createdAt}
                comments={post.children}
              />
            ))}
          </>
        )}
      </section>

      <Pagination
        path='/'
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />
    </>
  )
}
