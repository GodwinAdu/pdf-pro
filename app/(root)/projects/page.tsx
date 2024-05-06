import { Button } from "@/components/ui/button"
import { Ghost } from "lucide-react"


const page = () => {
    return (
        <main className="mx-auto max-w-7xl md:p-10">
            <div className="mt-2 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
                <h1 className="mb-3 font-bold text-2xl md:text-5xl text-gray-900">Projects</h1>
                <div className="flex gap-4 px-2">
                    <Button>Request Help</Button>
                </div>
            </div>
            <div className="mt-16 flex flex-col items-center gap-2">
                <Ghost className="h-8 w-8 text-zinc-800" />
                <h3 className="text-xl font-semi-bold">
                    Opps!, There&apos;s no file here
                </h3>
                <p>let&apos;s upload your first PDF.</p>
            </div>
        </main>
    )
}

export default page
