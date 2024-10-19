import ProjectForm from "@/components/ProjectForm"
import { fetchAssignmentById } from "@/lib/actions/assignment.actions"


const page = async ({ params }: { params: { projectId: string } }) => {

    const assignmentId = params.projectId
    const data = await fetchAssignmentById(assignmentId);
    return (
        <>
            <main className="mx-auto max-w-7xl p-2 md:p-10">
                <div className="mt-1 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
                    <h1 className="mb-3 font-bold text-2xl md:text-5xl text-gray-900">Update Request</h1>
                </div>
                <ProjectForm type="Update" data={data} />
            </main>
        </>
    )
}

export default page
