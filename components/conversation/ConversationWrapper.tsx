"use client";

import React from "react";
import { ConversationContextProvider } from "./ConversationContext";
import Messages from "./Messages";
import ConversationInput from "./ConversationInput";


interface Props{
  id:string;
}
const ConversationWrapper = ({ id }: Props) => {
  return (
    <ConversationContextProvider userId={id} >
      <div className="relative bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2 ">
        <div className="flex-1 justify-between flex flex-col mb-28">
          <Messages userId={id} />
        </div>

        <ConversationInput />
      </div>
    </ConversationContextProvider>
  );
};

export default ConversationWrapper;
