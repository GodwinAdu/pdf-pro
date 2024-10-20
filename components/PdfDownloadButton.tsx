"use client"

import React, { useState } from 'react'
import { Button } from './ui/button'
import { Download } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Packer, Document, Paragraph, TextRun, PageBreak } from 'docx';
import { saveAs } from 'file-saver';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PdfDownloadButton = ({ fileUrl }: { fileUrl: string }) => {
    const [isPdfLoading, setIsPdfLoading] = useState(false);
    const [isDocLoading, setIsDocLoading] = useState(false);

    const handleDownloadDocx = async (event: any) => {
        event.preventDefault();

        try {
            setIsDocLoading(true);
            // Load the PDF
            const pdf = await pdfjs.getDocument(fileUrl).promise;
            const numPages = pdf.numPages;

            // Array to store paragraphs representing each page
            const pageParagraphs = [];

            // Extract text from each page and add it to the Word document
            for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
                const page = await pdf.getPage(pageNumber);
                const textContent = await page.getTextContent();
                const pageText = textContent.items
                    .map((item: any) => (typeof item === "string" ? item : item.str))
                    .join(" ");

                // Create a paragraph for the page text
                const paragraph = new Paragraph({
                    children: [new TextRun(pageText)]
                });

                // Add the paragraph to the array
                pageParagraphs.push(paragraph);

                // Add a page break after each page, except the last one
                if (pageNumber !== numPages) {
                    pageParagraphs.push(new Paragraph({ children: [new PageBreak()] }));
                }
            }

            // Create the document with page paragraphs
            const doc = new Document({
                sections: [{
                    properties: {},
                    children: pageParagraphs
                }]
            });

            // Generate a unique filename using timestamp
            const timestamp = new Date().toISOString().replace(/[-:.]/g, ''); // Remove special characters from ISO timestamp
            const filename = `document_${timestamp}.docx`;

            // Save DOCX document
            const docxBlob = await Packer.toBlob(doc);
            saveAs(docxBlob, filename);

            console.log(`Downloaded PDF as Word document: ${filename}`);
        } catch (error) {
            console.error("Error converting PDF to Word document:", error);
        } finally {
            setIsDocLoading(false);
        }
    }


    const handleDownloadPdf = async (event: any) => {
        event.preventDefault();

        try {
            setIsPdfLoading(true);
            const response = await fetch(fileUrl, { cache: 'no-store' });
            const blob = await response.blob();
            // Generate a unique filename using timestamp
            const timestamp = new Date().toISOString().replace(/[-:.]/g, ''); // Remove special characters from ISO timestamp
            const filename = `filename_${timestamp}.pdf`;

            const a = document.createElement('a');
            const blobUrl = URL.createObjectURL(blob);

            a.href = blobUrl;
            a.download = filename;

            document.body.appendChild(a);
            a.click();

            document.body.removeChild(a);
            URL.revokeObjectURL(fileUrl);

            console.log("Downloaded PDF");
        } catch (error) {
            console.error("Error downloading PDF:", error);
        } finally {
            setIsPdfLoading(false);
        }
    }

    return (
        <>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        size="sm"
                        className="w-full bg-green-500 hover:bg-green-700"
                        onClick={handleDownloadPdf}
                    >
                        <Download className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleDownloadPdf}>
                        {isPdfLoading? "Loading..." :"Download PDF"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDownloadDocx}>
                        {isDocLoading? "Loading..." :"Download DOCX"}
                    </DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export default PdfDownloadButton;




// const handleDownloadDocx = async (event: any) => {
//     event.preventDefault();

//     try {
//         // Load the PDF
//         const pdf = await pdfjs.getDocument(fileUrl).promise;
//         const numPages = pdf.numPages;

//         // Extract text from each page and create a separate Word document for each page
//         for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
//             const page = await pdf.getPage(pageNumber);
//             const textContent = await page.getTextContent();
//             const pageText = textContent.items
//                 .map((item: any) => (typeof item === "string" ? item : item.str))
//                 .join(" ");

//             // Create a new Word document for the current page
//             const doc = new Document({
//                 sections: [{
//                     properties: {},
//                     children: [
//                         new Paragraph({
//                             children: [new TextRun(pageText)]
//                         })
//                     ]
//                 }]
//             });

//             // Generate a unique filename using timestamp and page number
//             const timestamp = new Date().toISOString().replace(/[-:.]/g, ''); // Remove special characters from ISO timestamp
//             const filename = `document_${pageNumber}_${timestamp}.docx`;

//             // Save the current page as a Word document
//             const docxBlob = await Packer.toBlob(doc);
//             saveAs(docxBlob, filename);

//             console.log(`Downloaded PDF page ${pageNumber} as Word document: ${filename}`);
//         }
//     } catch (error) {
//         console.error("Error converting PDF to Word document:", error);
//     }
// }
