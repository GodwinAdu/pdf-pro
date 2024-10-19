
import { createFile, fetchCurrentPDF, updateUploadStatus } from '@/lib/actions/file.actions';
import {
    createUploadthing,
    type FileRouter,
} from 'uploadthing/next'

import { OpenAIEmbeddings } from '@langchain/openai'
import { PineconeStore } from '@langchain/pinecone'
import { getPineconeClient } from '@/lib/pinecone'
import { currentUser } from '@/lib/helpers/current-user';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { deductCoinByPdfPages } from '@/lib/actions/coin.actions';


const f = createUploadthing()

const middleware = async () => {

    const user = await currentUser();
    console.log(user, "user authenticated in metadata")
    const userId = user._id;

    if (!userId) throw new Error('Unauthorized')


    return { userId }
}

const onUploadComplete = async ({
    metadata,
    file,
}: {
    metadata: Awaited<ReturnType<typeof middleware>>
    file: {
        key: string
        name: string
        url: string
    }
}) => {

    try {
        const { userId } = metadata
        // const user = await fetchUser({userId });

        const data = {
            key: file.key,
            name: file.name,
            userId,
            url: file.url,
            uploadStatus: 'PROCESSING',
        };

        console.log("creating file to DB", data)

        // await updateUserUpload(user?._id);
        await createFile(data);

    } catch (error) {
        console.log("couldnt create file to DB")
    }

    const fetchPdf = await fetchCurrentPDF({ key: file.key })
    try {

        console.log("files:", fetchPdf.url);
        // const value = `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`
        // const response = await fetchDataWithRetry(value, 10)
        const response = await fetch(fetchPdf.url, { cache: 'no-store' })
        const blob = await response.blob();
        const loader = new PDFLoader(blob);


        console.log("loader", loader)

        const pageLevelDocs = await loader.load();

        const pagesAmt = pageLevelDocs.length;

        console.log(pagesAmt)

        await deductCoinByPdfPages(pagesAmt, metadata.userId)

        // vectorize and index entire document
        const pinecone = await getPineconeClient()
        const pineconeIndex = pinecone.Index('summaq')


        const embeddings = new OpenAIEmbeddings({
            openAIApiKey: process.env.OPENAI_API_KEY,
        })

        await PineconeStore.fromDocuments(
            pageLevelDocs,
            embeddings,
            {
                pineconeIndex,
                namespace: fetchPdf._id,
            }
        )
        console.log("updating id", fetchPdf._id)
        // await pinecone.deleteIndex('summaq');
        await updateUploadStatus({
            fileId: fetchPdf._id,
            newStatus: 'SUCCESS',
        });

    } catch (err: any) {
        console.error('Error in the try block:', err);
        await updateUploadStatus({
            fileId: fetchPdf._id,
            newStatus: 'FAILED',
        });
    }
}

export const ourFileRouter = {
    serverImage: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
        .middleware(middleware)
        .onUploadComplete(() => { }),
    messageFile: f(["image", "pdf"])
        .middleware(middleware)
        .onUploadComplete(() => { }),
    pdfUploader: f({ pdf: { maxFileSize: '32MB' } })
        .middleware(middleware)
        .onUploadComplete(onUploadComplete),
    media: f({ image: { maxFileSize: '1MB' } })
        .middleware(middleware)
        .onUploadComplete(() => { }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter