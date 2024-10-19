
import Image from "next/image";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { currentUser } from "@/lib/helpers/current-user";
import CopyButton from "@/components/common/CopyButton";


const TableLink = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="flex  items-start gap-2  ">
      <h1 className="text-base font-medium text-sky-1 lg:text-xl xl:min-w-32">
        {title}:
      </h1>
      <h1 className="truncate  bg-gray-200 p-1 rounded-lg  text-sm font-bold max-sm:max-w-[220px] lg:text-xl">
        {description}
      </h1>
    </div>
  );
};



const Profile = async () => {

  const user = await currentUser();

  console.log(user, "suer id")

  if (!user) redirect("/sign-in");


  const userLink = `${process.env.NEXT_PUBLIC_BASE_URL}/sign-up?ref=${user.memberId}`;
  return (
    <>
      <div className="flex justify-between items-center ">
        {/* <Header title="Profile" /> */}
        <Link href="/profile/settings" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
          <Image
            src="/assets/icons/setting.svg"
            alt="logo"
            width={24}
            height={24}
            className="animate-spin"
          />
        </Link>

      </div>
      <Separator className="mt-2 bg-purple-gradient" />

      <div className="pt-4">
        <div className="flex  gap-2 items-center">
          <p className="text-xl md:text-2xl font-bold">Username :</p>
          <p className="font-bold ext-xl md:text-2xl text-gray-400">@{user?.username}</p>

          <Image
            src="/assets/icons/new-badge.svg"
            alt="new badge"
            width={20}
            height={20}
            className="size-7 md:size-9"
          />

        </div>
      </div>

      <section className="profile">
        <div className="profile-balance">
          <p className="p-14-medium md:p-16-medium">CREDITS AVAILABLE</p>
          <div className="mt-4 flex items-center gap-4">
            <Image
              src="/icons/coin.svg"
              alt="coins"
              width={50}
              height={50}
              className="size-9 md:size-12"
            />
            <h2 className="h2-bold text-dark-600">0</h2>
          </div>
        </div>

        <div className="profile-image-manipulation">
          <p className="p-14-medium md:p-16-medium">TOTAL QUIZES DONE</p>
          <div className="mt-4 flex items-center gap-4">
            <Image
              src="/assets/icons/quiz-length.svg"
              alt="coins"
              width={50}
              height={50}
              className="size-9 md:size-12"
            />
            <h2 className="h2-bold text-dark-600">{user?.TotalQuestions}</h2>
          </div>
        </div>
      </section>

      <section className='my-4'>
        <Card>
          <CardHeader>
            <CardTitle>Withdrawal Settings</CardTitle>

          </CardHeader>
          <CardContent className="space-y-2 flex flex-col gap-4">
            <div className="">
              <Link href="/settings/place-withdraw" className={cn(buttonVariants(), "bg-green-500 hover:bg-green-700")}>Place Withdrawal</Link>
            </div>

            <div className="">
              <Link href="/settings/transfer-coin" className={cn(buttonVariants(), "bg-rose-500 hover:bg-rose-700")}>Transfer Coin to Friends</Link>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-4 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <TableLink title="Member ID" description={user?.memberId} />
          <CopyButton type="id" value={user?.memberId} />
        </div>
        <div className="flex items-center gap-3">
          <TableLink title="Invite Link" description={userLink} />
          <CopyButton type="invite" value={userLink} />
        </div>
      </section>
    </>
  );
};

export default Profile;