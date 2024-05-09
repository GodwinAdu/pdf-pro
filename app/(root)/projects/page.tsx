import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Download, Edit, File, Ghost, Loader2, MessageSquare, Plus } from "lucide-react"
import Link from "next/link"
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns"
import { fetchAllAssignments } from "@/lib/actions/assignment.actions"
import { currentProfile } from "@/lib/profile/currentProfile";
import PaymentButton from "@/components/PaymentButton";
import PdfDownloadButton from "@/components/PdfDownloadButton";
import PdfReadButton from "@/components/PdfReadButton";


const page = async () => {
    const projects = await fetchAllAssignments();
    const profile = await currentProfile();



    return (
        <main className="mx-auto max-w-7xl p-2 md:p-10">
            <div className="mt-1 flex items-center justify-between gap-4 border-b border-gray-200 pb-2 sm:flex-row sm:items-center sm:gap-0">
                <h1 className="mb-3 font-bold text-2xl md:text-5xl text-gray-900">Projects</h1>
                <div className="flex gap-4 px-2">
                    <Link href="/projects/create" className={cn(buttonVariants({ size: "sm" }))}>
                        Request Help
                    </Link>
                </div>
            </div>
            {/**Display all user projects from database */}
            {projects && projects?.length !== 0 ? (
                <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
                    {projects
                        ?.sort(
                            (a, b) =>
                                new Date(b.createdAt).getTime() -
                                new Date(a.createdAt).getTime()
                        )
                        .map((project) => (
                            <li
                                key={project?._id}
                                className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition  hover:shadow-lg"
                            >
                                <Link
                                    href={`/projects/create/${project._id}`}
                                    className="flex flex-col gap-2"
                                >
                                    <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                                        <div className="flex-1 truncate">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex flex-col gap-1 items-center">
                                                    <h3 className="truncate text-lg font-medium text-zinc-900">
                                                        {project?.problemType}
                                                    </h3>
                                                    <p className="truncate  text-zinc-900">{project.question.split('').slice(0, 30).join('')}...</p>
                                                    <div>{project?.payed ? (
                                                        <>
                                                            <p className="text-sm text-green-500">Payed</p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p className="text-sm">Price: <span className="font-bold text-green-600">Gh{project?.price}</span></p>
                                                        </>
                                                    )}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>

                                <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500">
                                    <div className="flex items-center gap-2">
                                        {project?.status === "done" ? (
                                            <>
                                                <Plus className="h-4 w-4" />
                                                {format(new Date(project?.createdAt), "MMM yyyy")}
                                            </>
                                        ) : (
                                            <>
                                                <Link href={`/projects/create/${project?._id}`} className={cn(buttonVariants({ size: "sm" }))}>
                                                    <Edit className="w-3 h-3 mr-2" /> Edit
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                    {project.payed ? (
                                        <>
                                           <PdfReadButton fileUrl={project?.fileUrl} />
                                        </>
                                    ) : (
                                        <div className="flex items-center gap-2 font-bold">
                                            <File className="h-4 w-4" />
                                            {project.status}...
                                        </div>
                                    )}

                                    {project.payed ? (
                                        <>
                                            <PdfDownloadButton fileUrl={project?.fileUrl} />
                                        </>

                                    ) : (
                                        <>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    {project?.status === "done" ? (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                className="w-full"
                                                                disabled
                                                            >
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                className="w-full bg-green-600"
                                                            >
                                                                <Download className="h-4 w-4" />
                                                            </Button>
                                                        </>
                                                    )}
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Opps, Please make payment.
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            {`  Please pay an amount of GH${project.price} before you can download it.
                                                           For an issues, contact +233551556650`
                                                            }
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel className="bg-red-500 hover:bg-red-700 text-white hover:text-white">Cancel</AlertDialogCancel>
                                                        <PaymentButton projectId={project?._id} name={profile.fullname} email={profile.email} amount={project.price} fileUrl={project?.fileUrl} />
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </>
                                    )}

                                </div>
                            </li >
                        ))
                    }
                </ul >
            ) : (
                <div className="mt-16 flex flex-col items-center gap-2">
                    <Ghost className="h-8 w-8 text-zinc-800" />
                    <h3 className="text-xl font-semi-bold">
                        Opps!, There&apos;s no project here
                    </h3>
                    <p>let&apos;s upload your first PDF.</p>
                </div>
            )
            }
        </main >
    )
}

export default page
