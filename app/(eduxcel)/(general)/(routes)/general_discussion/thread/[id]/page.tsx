import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { currentUser } from "@/lib/helpers/current-user";
import ThreadCard from "@/components/general-discussion/cards/ThreadCard";
import Comment from "@/components/general-discussion/forms/Comment";

export const revalidate = 0;

async function page({ params }: { params: { id: string } }) {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;



  const thread = await fetchThreadById(params.id);

  return (
    <section className='relative'>
      <div>
        <ThreadCard
          thread={thread}
          id={thread._id}
          currentUserId={user._id}
          parentId={thread.parentId}
          content={thread.text}
          author={thread.author}
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      </div>

      <div className='mt-7'>
        <Comment
          threadId={params.id}
          currentUser={user}
        />
      </div>

      <div className='mt-10'>
        {thread.children.map((childItem: any) => (
          <ThreadCard
            thread={childItem}
            key={childItem._id}
            id={childItem._id}
            currentUserId={user._id}
            parentId={childItem.parentId}
            content={childItem.text}
            author={childItem.author}
            createdAt={childItem.createdAt}
            comments={childItem.children}
            isComment
          />
        ))}
      </div>
    </section>
  );
}

export default page;
