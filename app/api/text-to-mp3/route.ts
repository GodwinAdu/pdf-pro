import { NextRequest, NextResponse } from 'next/server';
import { createWriteStream } from 'fs';
import path from 'path';
import gTTS from 'gtts'; // Assuming gTTS is installed
import { promisify } from 'util';

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { text, languageCode } = body;

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        // Set the language and initialize gtts
        const gtts = new gTTS(text, languageCode || 'en');

        // Define the file name and path
        const fileName = `audio-${Date.now()}.mp3`;
        const filePath = path.resolve('./public/audios', fileName);

        // Promisify the gtts.save function
        const saveAudio = promisify(gtts.save).bind(gtts);

        // Generate the audio file asynchronously
        await saveAudio(filePath);

        // Return the URL for the saved file
        return NextResponse.json({ url: `/audios/${fileName}` }, { status: 200 });

    } catch (error) {
        console.error('Error generating audio:', error);
        return NextResponse.json({ error: error || 'Failed to synthesize speech.' }, { status: 500 });
    }
};
