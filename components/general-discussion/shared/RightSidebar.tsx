

import { Separator } from "@/components/ui/separator";
import UserCard from "../cards/UserCard";

import { fetchCommunities } from "@/lib/actions/community.actions";

import { currentUser } from "@/lib/helpers/current-user";

async function RightSidebar() {
  const user = await currentUser();
  if (!user) return null;

  // const similarMinds = await fetchUsers({
  //   userId: user._id,
  //   pageSize: 4,
  // });

  // const suggestedCOmmunities = await fetchCommunities({ pageSize: 4 });

  return (
    <section className='custom-scrollbar sticky right-0 top-0 z-20 flex h-screen w-fit flex-col justify-between gap-12 overflow-auto border-l border-l-black-4 bg-background px-10 pb-6 pt-28 max-xl:hidden'>
      <div className='flex flex-1 flex-col justify-start'>
        <h3 className='text-xl text-foreground font-bold'>
         Friend Requests
        </h3>
        <Separator />

        </div>
    </section>
  );
}

export default RightSidebar;
