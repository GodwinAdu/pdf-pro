import DashboardPage from "@/components/common/DashboardPage"
import { TransferModal } from "@/components/common/TransferModal"






const page = () => {
    const data: any[] = []
    return (
        <>
            <main className="">
                <div className="mt-2 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
                    <h1 className="mb-3 font-bold text-2xl md:text-5xl text-gray-900">Share Coins</h1>
                    <div className="flex gap-4 px-2">
                        <TransferModal />
                    </div>
                </div>
                <section className="px-2 py-4">
                    <DashboardPage />
                </section>
            </main>
        </>
    )
}

export default page