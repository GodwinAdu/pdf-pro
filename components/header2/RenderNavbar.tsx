
import { currentUser } from "@/lib/helpers/current-user"
import Navbar from "./Navbar"


const RenderNavbar = async () => {
const user = await currentUser()
  return (
    <>
      <Navbar user={user} />
    </>
  )
}

export default RenderNavbar
