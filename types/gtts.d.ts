declare module 'gtts' {
    class gTTS {
        constructor(text: string, lang?: string);
        save(path: string, callback: (err: Error | null) => void): void;
    }
    export = gTTS;
}
