import { Separator } from '@/components/ui/separator';
import { getActivity } from '@/lib/actions/user.actions';
import { currentUser } from '@/lib/helpers/current-user';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const page = async () => {
  const user = await currentUser();
  if (!user) return null;

  

  const activity = await getActivity(user._id);

  return (
    <>
      <h1 className='text-2xl font-bold mb-2'>Activities</h1>
      <Separator />

      <section className='mt-10 flex flex-col gap-5'>
        {activity.length > 0 ? (
          <>
            {activity.map((activity) => (
              <Link key={activity._id} href={`/general_discussion/thread/${activity.parentId}`}>
                <article className='activity-card'>
                  <Image
                    src={activity.author.imageUrl}
                    alt='user_logo'
                    width={20}
                    height={20}
                    className='rounded-full object-cover'
                  />
                  <p className='!text-small-regular text-light-1'>
                    <span className='mr-1 text-primary-500'>
                      {activity.author.name}
                    </span>{" "}
                    replied to your thread
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className='!text-base-regular text-light-3'>No activity yet</p>
        )}
      </section>
    </>
  );
}

export default page;
