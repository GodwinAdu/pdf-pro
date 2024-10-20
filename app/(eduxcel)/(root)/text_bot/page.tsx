
import SummarizeForm from "@/components/text-bot/summarizer/SummarizeForm"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { currentUser } from "@/lib/helpers/current-user"

import { BookOpenCheck, BookOpenText, BookType, NotebookPen } from "lucide-react"

const page = async () => {
  const user = await currentUser();
  return (
    <main className="mx-auto max-w-7xl p-1 md:p-4">
      <div className="mt-1 flex items-center justify-between gap-4 border-b border-gray-200 pb-2 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 font-bold text-2xl md:text-5xl text-gray-900">Text Manipulation</h1>
      </div>
      <Tabs defaultValue="summarizer" className="w-full h-screen">
        <div className="overflow-x-auto bg-white/75 backdrop-blur-lg max-w-5xl py-1">
          <TabsList className="">
            <TabsTrigger value="summarizer"><BookOpenCheck className="w-4 h-4 mr-1" />summarizer</TabsTrigger>
            <TabsTrigger value="paraphrase"><BookType className="w-4 h-4 mr-1" />paraphrase</TabsTrigger>
            <TabsTrigger value="text-improvement"><NotebookPen className="w-4 h-4 mr-1" />Text Improvement</TabsTrigger>
            <TabsTrigger value="grammar-error"><BookOpenText className="w-4 h-4 mr-1" />Grammar Error</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="summarizer">
          <Card className="md:h-[30rem]">
            <CardContent className="" >
              <SummarizeForm user={user} type="summarize" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="paraphrase">
          <Card>
            <CardContent >
              <SummarizeForm user={user} type="paraphrase" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="text-improvement">
          <Card>
            <CardContent >
              <SummarizeForm user={user} type="improvement" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="grammar-error">
          <Card>
            <CardContent >
              <SummarizeForm user={user} type="gec" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}

export default page


{/* */ }