"use client";

import { z } from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";


import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CommentValidation } from "@/lib/validations/comment";
import { addCommentToThread } from "@/lib/actions/thread.actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
  threadId: string;
  currentUser: any
}

function Comment({ threadId, currentUser }: Props) {
  const pathname = usePathname();

  const userId = currentUser?.id;

  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await addCommentToThread(
      threadId,
      values.thread,
      userId,
      pathname
    );

    form.reset();
  };

  return (
    <Form {...form}>
      <form className='mt-10 flex items-center gap-4 border-y border-y-dark-4 py-5 max-xs:flex-col !important' onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='thread'
          render={({ field }) => (
            <FormItem className='flex w-full items-center gap-3'>
              <FormLabel>
                <Avatar>
                  <AvatarImage src={currentUser.imageUrl} alt="@shadcn" />
                  <AvatarFallback>{currentUser?.fullName[0]}</AvatarFallback>
                </Avatar>
              </FormLabel>
              <FormControl className='border-none bg-transparent'>
                <Input
                  type='text'
                  {...field}
                  placeholder='Comment...'
                  className='no-focus text-light-1 outline-none'
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type='submit' className='rounded-3xl bg-green-500 hover:bg-green-700 px-8 py-2 !text-small-regular text-light-1 max-xs:w-full !important'>
          Reply
        </Button>
      </form>
    </Form>
  );
}

export default Comment;
