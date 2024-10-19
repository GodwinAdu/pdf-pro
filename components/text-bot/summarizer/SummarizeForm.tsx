"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowDownRight, ArrowUpLeft, ChevronDown, Copy, EllipsisVertical, Eraser, Loader2, Repeat2, Undo2 } from "lucide-react"
import { summarizeText } from "@/lib/text-bot/Summarizer"
import { useEffect, useState } from "react"
import { paraphraseTextFn } from "@/lib/text-bot/Paraphrase"
import { textImprovement } from "@/lib/text-bot/Improvement"
import { grammarCheck } from "@/lib/text-bot/GrammarCheck"
import { IUser } from "@/lib/models/user.models";
import axios from "axios"

const FormSchema = z.object({
    text: z
        .string({
            message: "Text is required please.",
        })
        .min(10, {
            message: "text must be at least 10 characters.",
        })
    // .max(500, {
    //     message: "text must not be longer than 500 characters.",
    // }),
})

interface GrammarProps {
    suggestion: string;
    startIndex: number;
    endIndex: number;
    originalText: string;
    correctionType: string;
}
interface ImprovementProps {
    suggestions: string[];
    startIndex: number;
    endIndex: number;
    originalText: string;
    correctionType: string;
}
interface ParaphraseProps {
    text: string;
}

const SummarizeForm = ({ type }: { type: string,  }) => {
    const [result, setResult] = useState<string>("")
    const [paraphraseText, setParaphaseText] = useState<ParaphraseProps[]>([])
    const [grammar, setGrammar] = useState<GrammarProps[] | null>(null)
    const [improvement, setImprovement] = useState<ImprovementProps[]>([])
    const [highlightedIndexes, setHighlightedIndexes] = useState<{ startIndex: number; endIndex: number } | null>(null);
    const [mode, setMode] = useState('characters');
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    const textInput = form.watch('text');

    const countWords = () => {
        return textInput?.trim().split(/\s+/).filter(Boolean).length;
    };

    const countCharacters = () => {
        return textInput?.length;
    };

    const handleModeChange = (mode: string) => {
        setMode(mode);
    };

    const clearInput = () => {
        form.setValue('text', ''); // Reset text input to empty string
    };
    const clearResult = () => {
        setResult('') // Reset text input to empty string
    };

    const copyInputText = (data: string) => {
        navigator.clipboard.writeText(data); // Copy input text to clipboard
    };

    function getType(type: string) {
        switch (type) {
            case 'summarize':
                return "Summarize"
                break;
            case 'paraphrase':
                return "Paraphrase"
                break;
            case 'improvement':
                return "Text Improvement"
                break;
            case 'gec':
                return "Grammar Check"
                break;
            default:
                // Handle other cases or throw an error for invalid types
                throw new Error(`Invalid type: ${type}`);
        }

    }


    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            // if (user.plan.planName === "free") {
            //     return toast({
            //         title: "Opps!. Only for Pro Users",
            //         description: "Please upgrade now to continue this offer. Thank you😃",
            //         variant: "destructive"
            //     })
            // }
            setIsLoading(true)
            if (type === "summarize") {
                const postData = { text: data.text };
                try {
                    const value = await axios.post('/api/summarize', postData, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    console.log(value.data, "value response");
                    setResult(value.data); // Handle the response correctly
                } catch (error) {
                    console.error('Error fetching summarized text:', error);
                }
            }
            if (type === "paraphrase") {
                const postData = { text: data.text };
                try {
                    const value = await axios.post('/api/paraphrase', postData, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    console.log(value.data, "value response");
                    setResult(value.data); // Handle the response correctly
                } catch (error) {
                    console.error('Error fetching summarized text:', error);
                }
            }
            if (type === "improvement") {
                const postData = { text: data.text };
                try {
                    const value = await axios.post('/api/text_improvement', postData, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    console.log(value.data, "value response");
                    setResult(value.data); // Handle the response correctly
                } catch (error) {
                    console.error('Error fetching summarized text:', error);
                }
            }
            if (type === "gec") {
                const postData = { text: data.text };
                try {
                    const value = await axios.post('/api/grammar_error', postData, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    console.log(value.data, "value response");
                    setResult(value.data); // Handle the response correctly
                } catch (error) {
                    console.error('Error fetching summarized text:', error);
                }
            }

        } catch (error) {
            console.log("something went wrong", error)
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    // const applySuggestions = (value) => {
    //     let updatedValue = value;
    //     improvement.forEach((data, index) => {
    //         const startIndex = data.startIndex;
    //         const endIndex = data.endIndex;
    //         const originalText = data.originalText;
    //         const suggestion = data.suggestions.join(', '); // Join suggestions if there are multiple

    //         const selection = originalText.substring(startIndex, endIndex);
    //         updatedValue = updatedValue.replace(selection, suggestion);
    //     });
    //     return updatedValue;
    // };
    // useEffect(() => {
    //     // Apply suggestions when the improvement state changes
    //     const updatedValue = applySuggestions(textInput);
    //     form.setValue('text', updatedValue); // Update form value with corrected text
    // }, [improvement]); // Run this effect whenever the improvement state changes

    // const handleChange = (value) => {
    //     // No need to manually call applySuggestions here
    //     form.setValue('text', value); // Update form value with the changed text
    // };




    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 h-full">
            <div className="space-y-2">
                <div className="flex justify-between items-center pt-2">
                    <Badge className="bg-blue-500 text-white"><ArrowDownRight className="w-4 h-4 mr-1" />Input</Badge>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <EllipsisVertical className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => copyInputText(textInput)} >
                                <Copy className="w-4 h-4 mr-1" />Copy Input
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={form.handleSubmit(onSubmit)} >
                                <Undo2 className="w-4 h-4 mr-1" /> Generate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={clearInput} >
                                <Eraser className="w-4 h-4 mr-1" /> Clear Input
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
                        <FormField
                            control={form.control}
                            name="text"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tell us a little bit about yourself"
                                            className="max-h-[30rem] min-h-[22rem] resize-none shadow-xl"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-between items-center">
                            <div className="flex gap-2 items-center">
                                {mode === 'words'
                                    ? `${textInput ? countWords() : 0} words`
                                    : `${textInput ? countCharacters() : 0} characters`
                                }
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="icon">
                                            <ChevronDown className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleModeChange('words')}>
                                            Words
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleModeChange('characters')}>
                                            Characters
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <Button size="sm" type="submit" className="hidden md:flex">
                                {isLoading ? "Generating..." : <Undo2 className="w-4 h-4 ml-1" />}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between items-center pt-2">
                    <Badge className="bg-green-500 text-white"><ArrowUpLeft className="w-4 h-4 mr-1" />Output</Badge>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <EllipsisVertical className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => copyInputText(result)} >
                                <Copy className="w-4 h-4 mr-1" /> Copy output
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={clearResult}>
                                <Eraser className="w-4 h-4 mr-1" /> Clear output
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                {type === "paraphrase" ? (
                    <div className="max-h-[30rem] min-h-[22rem] border-2 border-gray-200 shadow-xl rounded-md relative">
                        {textInput === "" || textInput === undefined ? (
                            <p className='text-gray-500 text-sm p-2'>Get your {getType(type)} output here ....</p>
                        ) : null}
                        {isLoading ? (
                            <div className='w-full mt-16 flex justify-center'>
                                <div className='flex flex-col items-center gap-2'>
                                    <Loader2 className='h-6 w-6 animate-spin text-zinc-800' />
                                    <h3 className='font-semibold md:text-lg text-md'>Please Wait ...
                                    </h3>
                                    <p className="text-xs md:text-sm">Result will be shown here soon... 😋😋😋</p>
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-y-auto max-h-[240px]">
                                {paraphraseText.map((data, index) => (
                                    <p key={index} className="p-2 text-sm space-y-2">{data.text}</p>
                                ))}
                            </div>
                        )}
                    </div>
                ) : null}
                {type === "summarize" ? (
                    <div className="max-h-[30rem] min-h-[22rem] border-2 border-gray-200 shadow-xl rounded-md relative">
                        {textInput === "" || textInput === undefined ? (
                            <p className='text-gray-500 text-sm p-2'>Get your {getType(type)} output here ....</p>
                        ) : null}
                        {isLoading ? (
                            <div className='w-full mt-16 flex justify-center'>
                                <div className='flex flex-col items-center gap-2'>
                                    <Loader2 className='h-6 w-6 animate-spin text-zinc-800' />
                                    <h3 className='font-semibold md:text-lg text-md'>Please Wait ...
                                    </h3>
                                    <p className="text-xs md:text-sm">Result will be shown here soon... 😋😋😋</p>
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-y-auto max-h-[240px]">
                                <p className="p-2 text-sm space-y-2">{result}</p>
                            </div>
                        )}
                    </div>
                ) : null}
                {type === "improvement" ? (
                    <div className="max-h-[30rem] min-h-[22rem] border-2 border-gray-200 shadow-xl rounded-md relative">
                        {textInput === "" || textInput === undefined ? (
                            <p className='text-gray-500 text-sm p-2'>Get your {getType(type)} output here ....</p>
                        ) : null}
                        {isLoading ? (
                            <div className='w-full mt-16 flex justify-center'>
                                <div className='flex flex-col items-center gap-2'>
                                    <Loader2 className='h-6 w-6 animate-spin text-zinc-800' />
                                    <h3 className='font-semibold md:text-lg text-md'>Please Wait ...
                                    </h3>
                                    <p className="text-xs md:text-sm">Result will be shown here soon... 😋😋😋</p>
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-y-auto max-h-[240px]">
                                {improvement && improvement.length === 0 && (
                                    <p className="p-2 text-sm space-y-2 text-center">There Is No Text Error. It looks perfect. 😍😍😘</p>
                                )}
                                {improvement.map((data, index) => (
                                    <div key={index} className="flex flex-col gap-2">
                                        <div className="p-2 text-sm flex gap-1 ">Suggestion:{data.suggestions.map((v) => <p className="text-green-500 underline">{v}</p>)}</div>
                                        <p className="p-2 text-sm space-y-2">Original Text:  <span className="text-red-500 underline">{data?.originalText}</span></p>
                                        <p className="p-2 text-sm space-y-2">Description:  <span className="text-red-500 underline">{data?.originalText}</span></p>

                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : null}
                {type === "gec" ? (
                    <div className="max-h-[30rem] min-h-[22rem] border-2 border-gray-200 shadow-xl rounded-md relative">
                        {textInput === "" || textInput === undefined ? (
                            <p className='text-gray-500 text-sm p-2'>Get your {getType(type)} output here ....</p>
                        ) : null}
                        {isLoading ? (
                            <div className='w-full mt-16 flex justify-center'>
                                <div className='flex flex-col items-center gap-2'>
                                    <Loader2 className='h-6 w-6 animate-spin text-zinc-800' />
                                    <h3 className='font-semibold md:text-lg text-md'>Please Wait ...
                                    </h3>
                                    <p className="text-xs md:text-sm">Result will be shown here soon... 😋😋😋</p>
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-y-auto max-h-[240px]">
                                {grammar && grammar.length === 0 && (
                                    <p className="p-2 text-sm space-y-2 text-center">There Is No Grammar Error. It looks perfect. 😍😍😘</p>
                                )}
                                {grammar && grammar?.map((data, index) => (
                                    <div key={index} className="flex gap-4">
                                        <p className="p-2 text-sm space-y-2 ">Suggestion: <span className="text-green-500">{data?.suggestion}</span></p>
                                        <p className="p-2 text-sm space-y-2">Original Text:  <span className="text-red-500">{data?.originalText}</span></p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : null}

                <div className="flex justify-between items-end pt-2 ">
                    <div className=""></div>
                    <Button size="sm" onClick={() => copyInputText(result)} className="bg-green-500 hover:bg-green-700 hidden md:flex" type="submit"><Copy className="w-4 h-4 " /></Button>
                </div>
            </div>
        </div >

    )
}

export default SummarizeForm
