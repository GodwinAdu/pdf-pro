
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
import { currentProfile } from "@/lib/profile/currentProfile"
import { BookOpenCheck, BookOpenText, BookType, NotebookPen } from "lucide-react"

const page = async () => {
  const user = await currentProfile();
  return (
    <main className="mx-auto max-w-7xl p-1 md:p-4">
      <div className="mt-1 flex items-center justify-between gap-4 border-b border-gray-200 pb-2 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 font-bold text-2xl md:text-5xl text-gray-900">Text Manupulation</h1>
      </div>
      <Tabs defaultValue="summarizer" className="w-full">
        <div className="overflow-x-auto sticky -top-4 z-50 bg-white/75 backdrop-blur-lg max-w-5xl mx-auto">
          <TabsList className="">
            <TabsTrigger value="summarizer"><BookOpenCheck className="w-4 h-4 mr-1" />summarizer</TabsTrigger>
            <TabsTrigger value="paraphrase"><BookType className="w-4 h-4 mr-1" />paraphrase</TabsTrigger>
            <TabsTrigger value="text-improvement"><NotebookPen className="w-4 h-4 mr-1" />Text Improvement</TabsTrigger>
            <TabsTrigger value="grammar-error"><BookOpenText className="w-4 h-4 mr-1" />Grammar Error</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="summarizer">
          <Card className="">
            <CardContent className="space-y-2">
              <SummarizeForm user={user} type="summarize" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="paraphrase">
          <Card>
            <CardContent className="space-y-2">
              <SummarizeForm user={user} type="paraphrase" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="text-improvement">
          <Card>
            <CardContent className="space-y-2">
              <SummarizeForm user={user} type="improvement" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="grammar-error">
          <Card>
            <CardContent className="space-y-2">
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