import ProjectForm from "@/components/ProjectForm"
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { auth } from "@clerk/nextjs/server"

const page = async () => {
    const { userId } = auth();
    return (
        <main className="mx-auto max-w-7xl p-2 md:p-10">
            <div className="mt-1 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
                <h1 className="mb-3 font-bold text-2xl md:text-5xl text-gray-900">Submit Request</h1>
            </div>
            <Card className="w-full mt-2">
                <CardContent>
                    <div className="">
                        <ProjectForm type="Create"  />
                    </div>
                </CardContent>
            </Card>
        </main>
    )
}

export default page
