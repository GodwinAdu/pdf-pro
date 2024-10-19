import { findServersWithChannelByProfileId } from "@/lib/actions/server.actions";
import { currentUser } from "@/lib/helpers/current-user";
import { redirect } from "next/navigation";



interface ServerIdPageProps {
  params: {
    serverId: string;
  }
};

const ServerPage = async ({
  params
}: ServerIdPageProps) => {
  const profile = await currentUser();
  
  const server = await findServersWithChannelByProfileId(profile?._id)

  if(!server) redirect('/group_discussion')


  const initialChannel = server[0]?.channels[0];


  if (initialChannel?.name !== "general") {
    return null;
  }

  return redirect(`/group_discussion/servers/${params.serverId}/channels/${initialChannel?._id}`)
}


export default ServerPage