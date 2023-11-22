import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function AssignmentModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-4" size="lg">
          Get help now
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[96%] max-w-3xl">
        <DialogHeader>
          <DialogTitle>How can we help you</DialogTitle>
          <DialogDescription>
            Struggling with Assignments? We've Got You Covered!
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 px-2">
          <div className="">
            <p className="text-sm leading-7">
              Stuck on school assignments? We offer expert solutions for any
              subject, from basic to tertiary topics. Get help with English
              writing, essays, typing, research, nursing case studies, and more.
              We can even assist with online exams in some cases. Don't
              stress—reach out for personalized support and conquer your
              academic challenges today!
            </p>
            <div className="mt-5">
              <Link href="/assignment-detail" className="text-blue-500">
                Read More
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
