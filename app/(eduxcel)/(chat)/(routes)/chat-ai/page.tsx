import ConversationWrapper from "@/components/conversation/ConversationWrapper";
import { currentUser } from "@/lib/helpers/current-user";

import React from "react";

const page = async () => {
  const user = await currentUser();
  return (
    <div>
     <ConversationWrapper id={user._id as string} />
    </div>
  );
};

export default page;
