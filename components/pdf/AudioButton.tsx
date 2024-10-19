"use client";

import { AudioLines, BotIcon, CircleStop, Headphones, History, Pause, Play, Settings, Volume2, Repeat, FastForward, Rewind, Download } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

// Define audio rates and pitches
const audioRates = ["0.2", "0.5", "0.7", "1", "1.5", "2", "2.5", "3"];
const pitches = ["0.5", "1", "1.5", "2"];

const AudioButton = ({ text }: { text: string }) => {
    const [rate, setRate] = useState<number>(() => parseFloat(localStorage.getItem('audioRate') || audioRates[2]));
    const [pitch, setPitch] = useState<number>(() => parseFloat(localStorage.getItem('audioPitch') || pitches[1]));
    const [volume, setVolume] = useState<number>(1);
    const [loop, setLoop] = useState<boolean>(false);
    const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesisUtterance | null>(null);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPause, setIsPause] = useState(false);
    const [highlightedText, setHighlightedText] = useState<string[]>([]);  // For text highlighting
    const [progress, setProgress] = useState<number>(0);
    const progressRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchVoices = () => setVoices(window.speechSynthesis.getVoices());
        fetchVoices();
        window.speechSynthesis.onvoiceschanged = fetchVoices;
    }, []);

    useEffect(() => {
        const savedVoice = localStorage.getItem('audioVoice');
        if (savedVoice && voices.length > 0) {
            setVoice(voices.find(v => v.name === savedVoice) || null);
        }
    }, [voices]);

    useEffect(() => {
        localStorage.setItem('audioRate', rate.toString());
        localStorage.setItem('audioPitch', pitch.toString());
        if (voice) localStorage.setItem('audioVoice', voice.name);
    }, [rate, pitch, voice]);

    const startSpeech = () => {
        if (text) {
            const synthesis = new SpeechSynthesisUtterance(text);
            synthesis.voice = voice;
            synthesis.rate = rate;
            synthesis.pitch = pitch;
            synthesis.volume = volume;
            synthesis.onend = () => {
                setIsPlaying(false);
                setProgress(0);
                setHighlightedText([]);  // Reset highlights
                if (loop) startSpeech(); // Restart if loop is enabled
            };
            synthesis.onboundary = (event) => {
                const spokenText = text.substring(0, event.charIndex);
                const words = spokenText.split(/\s+/);
                setHighlightedText(words);  // Highlight spoken words
                const percentComplete = (event.charIndex / text.length) * 100;
                setProgress(percentComplete);
            };
            setSpeechSynthesis(synthesis);
            window.speechSynthesis.speak(synthesis);
            setIsPlaying(true);
        }
    };

    const pauseSpeech = () => {
        if (speechSynthesis) {
            window.speechSynthesis.pause();
            setIsPlaying(false);
            setIsPause(true);
        }
    };

    const resumeSpeech = () => {
        if (speechSynthesis) {
            window.speechSynthesis.resume();
            setIsPlaying(true);
            setIsPause(false);
        }
    };

    const stopSpeech = () => {
        if (speechSynthesis) {
            window.speechSynthesis.cancel();
            setSpeechSynthesis(null);
            setIsPlaying(false);
            setIsPause(false);
            setProgress(0);
            setHighlightedText([]);  // Reset highlights
        }
    };

    const toggleLoop = () => setLoop(!loop);

    const handleVolumeChange = (newVolume: number[]) => setVolume(newVolume[0]);

    async function downloadAudio(text: string, languageCode = 'en-US') {
        try {
            // Make the POST request to your API route
            const response = await fetch('/api/text-to-mp3', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text, languageCode }),
            });

            // Parse the JSON response
            const data = await response.json();
            console.log(data,"data")

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate audio.');
            }

            // Extract the audio file URL from the response
            const audioUrl = data.url;

            // Create an anchor element and trigger the download
            const link = document.createElement('a');
            link.href = audioUrl;
            link.download = `audio-${Date.now()}.mp3`; // Set the file name for the download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading audio:', error);
        }
    }



    return (
        <div className="relative inline-block">
            <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="relative z-50 cursor-pointer shadow-black flex gap-3 items-center bg-white rounded-full shadow-2xl p-2 border-black"
            >
                <BotIcon />
                {isPlaying && !dropdownOpen && <AudioLines className="w-4 h-4 animate-ping z-50" />}
            </button>

            {dropdownOpen && (
                <div className="absolute z-[50] flex left-8 -top-10 mt-4 bg-white border border-gray-300 shadow-lg rounded-md">
                    {isPlaying ? (
                        <button onClick={pauseSpeech} className="block w-full py-2 text-left px-4 hover:bg-gray-100">
                            <Pause />
                        </button>
                    ) : !isPause ? (
                        <button onClick={startSpeech} className="block w-full py-2 text-left px-4 hover:bg-gray-100">
                            <Play />
                        </button>
                    ) : null}

                    {isPause && (
                        <button onClick={resumeSpeech} className="block w-full py-2 text-left px-4 hover:bg-gray-100">
                            <History />
                        </button>
                    )}

                    <button onClick={stopSpeech} className="block w-full py-2 text-left px-4 hover:bg-gray-100">
                        <CircleStop />
                    </button>

                    <button onClick={toggleLoop} className="block w-full py-2 text-left px-4 hover:bg-gray-100">
                        <Repeat className={loop ? "text-green-500" : ""} />
                    </button>

                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="block w-full py-2 text-left px-4 hover:bg-gray-100">
                                <Settings />
                            </button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Audio Settings</DialogTitle>
                            </DialogHeader>
                            <div className="flex flex-col gap-4">
                                <Select defaultValue={rate.toString()} onValueChange={(value) => setRate(parseFloat(value))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select audio rate" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Audio Rates</SelectLabel>
                                            {audioRates.map((audio, index) => (
                                                <SelectItem key={index} value={audio}>{audio}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                                <Select defaultValue={pitch.toString()} onValueChange={(value) => setPitch(parseFloat(value))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select pitch" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Pitch Levels</SelectLabel>
                                            {pitches.map((p, index) => (
                                                <SelectItem key={index} value={p}>{p}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                                <div className="flex flex-col items-center">
                                    <Volume2 />
                                    <Slider defaultValue={[volume]} max={1} step={0.1} onValueChange={handleVolumeChange} />
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <button onClick={() => downloadAudio(text)} className="block w-full py-2 text-left px-4 hover:bg-gray-100">
                        <Download />
                    </button>
                </div>
            )}

            <div ref={progressRef} className="h-1 bg-gray-300 w-full mt-2 rounded-full">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${progress}%` }} />
            </div>

            {/* Text highlighting */}
            <p className="mt-2 text-sm">
                {text.split(" ").map((word, index) => (
                    <span key={index} className={highlightedText.includes(word) ? "bg-yellow-300" : ""}>
                        {word}{" "}
                    </span>
                ))}
            </p>
        </div>
    );
};

export default AudioButton;
