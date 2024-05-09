"use client"

import { useEffect, useState } from 'react'
import { Button } from './ui/button'

const PdfReadButton = ({ fileUrl }: { fileUrl: string }) => {
    const [pdfLink, setPdfLink] = useState('')

    const handleOpenPdf = async () => {
        try {
            const response = await fetch(fileUrl, { cache: 'no-store' });
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            setPdfLink(blobUrl)
        } catch (error: any) {
            console.error("Error downloading PDF:", error);
        }
    }
    useEffect(() => {
        handleOpenPdf()
    }, [])


    const handleOpen = () => {
        window.open(pdfLink, '_blank');
    }
    return (
        <>
            <Button className='bg-indigo-400' onClick={handleOpen} size="sm">
                Read
            </Button>
        </>
    )
}

export default PdfReadButton
