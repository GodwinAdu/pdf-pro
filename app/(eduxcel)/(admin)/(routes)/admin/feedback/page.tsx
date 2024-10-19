import { Separator } from '@/components/ui/separator'

const page = () => {
    return (
        <main className=" p-1 md:p-4">
            <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-2 sm:flex-row sm:items-center sm:gap-0">
                <h1 className="py-2 font-bold text-xl md:text-3xl text-gray-900">FeedBacks</h1>
            </div>
            <Separator />
        </main>
    )
}

export default page
