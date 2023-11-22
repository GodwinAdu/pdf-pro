import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Expand, Loader2 } from 'lucide-react'
import SimpleBar from 'simplebar-react'
import { Document, Page, pdfjs } from 'react-pdf'
import { useToast } from '../ui/use-toast'
import { useResizeDetector } from 'react-resize-detector'

interface PdfFullscreenProps {
  fileUrl: string
}

const PdfFullscreen = ({ fileUrl }: PdfFullscreenProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [numPages, setNumPages] = useState<number>()
  const [pdfText, setPdfText] = useState<string>('');
  const [speechSynthesis, setSpeechSynthesis] = useState(null);
  const [voice, setVoice] = useState(null);
  const [voices, setVoices] = useState([]);


  const { toast } = useToast()

  const { width, ref } = useResizeDetector()

  const fetchPdfText = async (fileUrl:string) => {
    try {
      const pdf = await pdfjs.getDocument(fileUrl).promise;
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        content.items.forEach((item) => {
          text += item.str + ' ';
        });
      }
      setPdfText(text);
    } catch (error) {
      console.error('Error fetching PDF text:', error);
    }
  };

  const fetchVoices = () => {
    const availableVoices = window.speechSynthesis.getVoices();
    setVoices(availableVoices!);
    // You can set a default voice here if needed.
    // For example, select the first voice:
    setVoice(availableVoices[0]);
  };
  
  // Fetch and extract text from the PDF when it loads
  useEffect(() => {
    fetchPdfText(fileUrl);
  }, [fileUrl]);
  
  
  useEffect(() => {
    fetchVoices();
    // Listen for voiceschanged event to update voices when available voices change.
    window.speechSynthesis.onvoiceschanged = fetchVoices;
  }, []);
  

  console.log(pdfText)
  console.log(voices)
  console.log(voice)
  // const changeVoice = (newVoice) => {
  //   if (pdfText) {
  //     const synthesis = new SpeechSynthesisUtterance(pdfText);
  //     synthesis.voice = newVoice;
  //     synthesis.rate = 1; // Adjust the speech rate if needed
  //     synthesis.onend = () => {
  //       // Handle the end of speech
  //     };
  //     setSpeechSynthesis(synthesis);
  //     window.speechSynthesis.speak(synthesis);
  //   }
  // };
  const startSpeech = () => {
    if (pdfText) {
      const synthesis = new SpeechSynthesisUtterance(pdfText);
      synthesis.lang = 'en-US'; // Change the language if needed
      synthesis.rate = 0.5; // Adjust the speech rate if needed
      synthesis.onend = () => {
        // Handle the end of speech
      };
      setSpeechSynthesis(synthesis);
      window.speechSynthesis.speak(synthesis);
    }
  };
  
  const pauseSpeech = () => {
    if (speechSynthesis) {
      window.speechSynthesis.pause();
    }
  };
  
  const resumeSpeech = () => {
    if (speechSynthesis) {
      window.speechSynthesis.resume();
    }
  };
  
  const stopSpeech = () => {
    if (speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeechSynthesis(null);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v)
        }
      }}>
      <DialogTrigger
        onClick={() => setIsOpen(true)}
        asChild>
        <Button
          variant='ghost'
          className='gap-1.5'
          aria-label='fullscreen'>
          <Expand className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-7xl w-full'>
      <Button
          variant='ghost'
          className='gap-1.5'
          aria-label='start-speech'
          onClick={startSpeech}
        >
          Start Speech
        </Button>
      <Button
          variant='ghost'
          className='gap-1.5'
          aria-label='start-speech'
          onClick={stopSpeech}
        >
          Stop Speech
        </Button>
        <SimpleBar
          autoHide={false}
          className='max-h-[calc(100vh-10rem)] mt-6'>
          <div ref={ref}>
            <Document
              loading={
                <div className='flex justify-center'>
                  <Loader2 className='my-24 h-6 w-6 animate-spin' />
                </div>
              }
              onLoadError={() => {
                toast({
                  title: 'Error loading PDF',
                  description: 'Please try again later',
                  variant: 'destructive',
                })
              }}
              onLoadSuccess={({ numPages }) =>
                setNumPages(numPages)
              }
              file={fileUrl}
              className='max-h-full'>
              {new Array(numPages).fill(0).map((_, i) => (
                <Page
                  key={i}
                  width={width ? width : 1}
                  pageNumber={i + 1}
                />
              ))}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  )
}

export default PdfFullscreen
