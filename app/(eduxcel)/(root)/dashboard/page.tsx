import Dashboard from "@/components/dashboard/Dashboard";import { fetchCoinByUserId } from "@/lib/actions/coin.actions";
;
import { currentUser } from "@/lib/helpers/current-user";





const page = async () => {

  const dbUser = await currentUser();
  const coin = await fetchCoinByUserId() ?? 0;
 
  return <Dashboard coin={coin} user={dbUser} />
}

export default page
