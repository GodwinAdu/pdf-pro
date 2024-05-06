"use client"

import { AudioLines, CircleStop, Headphones, History, Pause, Play, Settings } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react';
import AudioWave from './AudioWave';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '../ui/button';

const audioRates = ["0.5", " 0.7", "1", "1.5", "2", "2.5", "3"]


const AudioButton = ({ text }: { text: string }) => {

    const [speechSynthesis, setSpeechSynthesis] = useState(null);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [voice, setVoice] = useState<SpeechSynthesisVoice>(voices[0]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPause, setIsPause] = useState(false);
    const [rate, setRate] = useState<number>(parseFloat(audioRates[2]));


    useEffect(() => {
        // Load saved rate from localStorage or default to 1
        const savedRate = localStorage.getItem('audioRate');
        if (savedRate) {
            setRate(parseFloat(savedRate));
        }

        // Load saved voice from localStorage
        const savedVoice = localStorage.getItem('audioVoice');
        console.log(savedVoice, "saved voice");
        if (savedVoice) {
            const foundVoice = voices?.find(voice => voice === savedVoice);
            if (foundVoice) {
                setVoice(foundVoice);
            }
            console.log(foundVoice, "found voice")
        }
    }, []);

    useEffect(() => {
        // Save rate to localStorage when changed
        localStorage.setItem('audioRate', rate.toString());
    }, [rate]);

    useEffect(() => {
        // Save voice name to localStorage when changed
        if (voice) {
            localStorage.setItem('audioVoice', JSON.parse(JSON.stringify(voice)));
        }
    }, [voice]);

    const toggleDropdown = () => {
        setDropdownOpen((prevState) => !prevState);
    };


    const fetchVoices = () => {
        const availableVoices: SpeechSynthesisVoice[] = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
    };

    useEffect(() => {
        fetchVoices();
        // Listen for voiceschanged event to update voices when available voices change.
        window.speechSynthesis.onvoiceschanged = fetchVoices;
    }, []);


    // console.log(pdfText)
    console.log(voices, "voices")
    console.log(voice, "voice")
  
    const startSpeech = () => {
        if (text) {
            setIsPlaying(true)
            const synthesis = new SpeechSynthesisUtterance(text);
            synthesis.lang = 'en-US'; // Change the language if needed
            synthesis.rate = 1; // Adjust the speech rate if needed
            synthesis.voice = voice;
            synthesis.onend = () => {
                // Handle the end of speech
                setIsPlaying(false)
            }
            setSpeechSynthesis(synthesis);
            window.speechSynthesis.speak(synthesis);
        }
    };

    const pauseSpeech = () => {
        if (speechSynthesis) {
            window.speechSynthesis.pause();
            setIsPlaying(false);
            setIsPause(true)
        }
    };

    const resumeSpeech = () => {
        if (speechSynthesis) {
            window.speechSynthesis.resume();
            setIsPlaying(true);
            setIsPause(false)
        }
    };

    const stopSpeech = () => {
        if (speechSynthesis) {
            window.speechSynthesis.cancel();
            setSpeechSynthesis(null);
            setIsPlaying(false);
            setIsPause(false)
        }
    };

    return (

        <div className="relative inline-block">

            <button
                onClick={toggleDropdown}
                className="relative z-50 cursor-pointer shadow-black flex gap-5 items-center"
            >
                <Headphones /> {isPlaying ? (!dropdownOpen ? <AudioLines className="w-4 h-4 animate-ping z-50" /> : null) : null}
            </button>
            {dropdownOpen && (
                <div className="absolute z-[50] flex left-8 -top-10 mt-4  bg-white border border-gray-300 shadow-lg rounded-md">
                    {isPlaying ? (
                        <button onClick={pauseSpeech} className="block w-full py-2 text-left px-4 hover:bg-gray-100">
                            <Pause />
                        </button>
                    ) : (
                        <>
                            {!isPause ? (
                                <button onClick={startSpeech} className="block w-full py-2 text-left px-4 hover:bg-gray-100">
                                    <Play />
                                </button>
                            ) : null}
                        </>

                    )}
                    {isPause && (
                        <button onClick={resumeSpeech} className="block w-full py-2 text-left px-4 hover:bg-gray-100 ">
                            < History />
                        </button>
                    )}

                    <button onClick={stopSpeech} className="block w-full py-2 text-left px-4 hover:bg-gray-100">
                        <CircleStop />
                    </button>
                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="block w-full py-2 text-left px-4 hover:bg-gray-100">
                                <Settings />
                            </button>
                        </DialogTrigger>
                        <DialogContent className="">
                            <DialogHeader>
                                <DialogTitle>Audio Settings</DialogTitle>
                            </DialogHeader>
                            <div className="flex gap-4">
                                <Select defaultValue={rate.toString()} onValueChange={(value) => setRate(parseFloat(value))}>
                                    <SelectTrigger className="w-">
                                        <SelectValue placeholder="Select audio rate" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Audio Rates</SelectLabel>
                                            {audioRates.map((audio, index) => (
                                                <SelectItem key={index} value={audio.toString()}>{audio}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <Select defaultValue={voice?.name} onValueChange={(value) => setVoice(value)}>
                                    <SelectTrigger className="">
                                        <SelectValue placeholder="Select a voice" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>choose voices</SelectLabel>
                                            {voices.slice(0,4).map((voice: SpeechSynthesisVoice, index: number) => (
                                                <SelectItem key={index} value={voice as SpeechSynthesisVoice}>{voice?.name?.split('').slice(0, 15).join('')}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </DialogContent>
                    </Dialog>

                </div>
            )
            }
        </div >


    )
}

export default AudioButton
