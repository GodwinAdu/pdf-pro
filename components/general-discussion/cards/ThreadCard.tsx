import Image from "next/image";
import Link from "next/link";
import { formatDateString } from "@/lib/utils";
import DeleteThread from "../forms/DeleteThread";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import moment from "moment";
import HeartFavorite from "../shared/HeartFavorite";
import UserDetails from "@/components/UserDetails";

interface Props {
  id: string;
  currentUserId: string | undefined;
  parentId: string | null;
  content: string;
  thread: any;
  author: {
    fullName: string;
    imageUrl: string;
    id: string;
  };
  createdAt: string;
  comments: {
    author: {
      fullName: string;
      imageUrl: string;
    };
  }[];
  isComment?: boolean;
}

function ThreadCard({
  id,
  thread,
  currentUserId,
  parentId,
  content,
  author,
  createdAt,
  comments,
  isComment,
}: Props) {
  return (
    <article
      className={`flex w-full flex-col rounded-xl shadow-xl ${isComment ? "px-4 py-4 xs:px-7" : "bg-background p-7"
        }`}
    >
      <div className='flex items-start justify-between'>
        <div className='flex w-full flex-1 flex-row gap-4'>
          <div className='flex flex-col items-center'>
            
             <UserDetails user={author} />
            <div className='relative mt-2 w-0.5 grow rounded-full bg-green-800' />
          </div>

          <div className='flex w-full flex-col'>
            <Link href={`#`} className='w-fit'>
              <h4 className='cursor-pointer text-base-semibold text-light-1'>
                {author.fullName}
              </h4>
            </Link>

            <p className='mt-2 text-small-regular text-light-2'>{content}</p>

            <div className={`${isComment && "mb-10"} mt-5 flex flex-col gap-3`}>
              <div className='flex gap-3.5'>
                  <HeartFavorite thread={thread} userId={currentUserId as string} />
                {/* Reply Tooltip */}
                <div className="relative group">
                  <Link href={`/general_discussion/thread/${id}`}>
                    <div className="flex items-center gap-1">
                      <Image
                        src='/assets/reply.svg'
                        alt='reply'
                        width={24}
                        height={24}
                        className='cursor-pointer object-contain'
                      />
                      <p className="text-xs">{thread.children.length}</p>
                    </div>
                  </Link>
                  <div className="absolute left-1/2 transform -translate-x-1/2 -top-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-800 text-white text-xs rounded-md py-1 px-2 pointer-events-none">
                    Reply
                  </div>
                </div>

                {/* Repost Tooltip */}
                <div className="relative group">
                  <div className="flex gap-1 items-center">
                    <Image
                      src='/assets/repost.svg'
                      alt='repost'
                      width={24}
                      height={24}
                      className='cursor-pointer object-contain'
                    />
                     <p className="text-xs">{thread.shares}</p>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 -top-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-800 text-white text-xs rounded-md py-1 px-2 pointer-events-none">
                    Share
                  </div>
                </div>

              </div>

              {isComment && comments.length > 0 && (
                <Link href={`/general_discussion/thread/${id}`}>
                  <p className='mt-1 text-subtle-medium text-muted-foreground'>
                    {comments.length} repl{comments.length > 1 ? "ies" : "y"}
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>

        <DeleteThread
          threadId={JSON.stringify(id)}
          currentUserId={currentUserId}
          authorId={author.id}
          parentId={parentId}
          isComment={isComment}
        />
      </div>

      {!isComment && comments.length > 0 && (
        <div className='ml-1 mt-3 flex items-center gap-2'>
          {comments.slice(0, 3).map((comment, index) => (
            <Avatar key={index} className={`w-8 h-8 ${index !== 0 && "-ml-5"}`}>
              <AvatarImage src={comment.author.imageUrl} alt="@shadcn" />
              <AvatarFallback>{comment.author?.fullName[0]}</AvatarFallback>
            </Avatar>
          ))}

          <Link href={`/general_discussion/thread/${id}`}>
            <p className='mt-1 text-xs text-gray-1'>
              {comments.length} repl{comments.length > 1 ? "ies" : "y"}
            </p>
          </Link>
        </div>
      )}
      <p className='text-xs text-gray-1 flex justify-end'>
        {moment(createdAt).fromNow()}
      </p>

    </article>
  );
}

export default ThreadCard;
