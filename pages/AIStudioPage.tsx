
import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import { GoogleGenAI } from "@google/genai";
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNav from '../components/BottomNav';
import { useLanguage } from '../contexts/LanguageContext';

const AIStudioPage: React.FC = () => {
    const { t } = useLanguage();
    const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
    const [mimeType, setMimeType] = React.useState<string>('image/jpeg');
    const [prompt, setPrompt] = React.useState('');
    const [generatedImage, setGeneratedImage] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const onDrop = React.useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            setMimeType(file.type);
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setSelectedImage(result);
                setGeneratedImage(null); // Reset generated image on new upload
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxFiles: 1
    });

    const handleGenerate = async () => {
        if (!selectedImage || !prompt) return;
        setIsLoading(true);
        setError('');

        try {
            // Remove data:image/xxx;base64, prefix for the API
            const base64Data = selectedImage.split(',')[1];
            
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [
                        {
                            inlineData: {
                                data: base64Data,
                                mimeType: mimeType,
                            },
                        },
                        {
                            text: prompt,
                        },
                    ],
                },
            });

            let foundImage = false;
            // Iterate through parts to find the image part
            if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
                for (const part of response.candidates[0].content.parts) {
                    if (part.inlineData) {
                        const base64EncodeString = part.inlineData.data;
                        const imageUrl = `data:image/png;base64,${base64EncodeString}`;
                        setGeneratedImage(imageUrl);
                        foundImage = true;
                        break;
                    }
                }
            }

            if (!foundImage) {
                 setError("The model did not return an image. It might have refused the prompt or returned only text.");
            }

        } catch (err: any) {
            console.error("AI Generation Error:", err);
            setError(err.message || "Failed to generate image.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Header />
            <main className="flex-grow container mx-auto p-4 sm:p-8 pt-28">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-bold text-slate-800 mb-2">AI Creative Studio</h1>
                        <p className="text-slate-600">Edit and transform your images using natural language prompts.</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                        {/* 1. Upload Section */}
                        <div className="mb-8">
                            <label className="block text-sm font-bold text-slate-700 mb-2">1. Upload Source Image</label>
                            <div 
                                {...getRootProps()} 
                                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-[--accent] bg-purple-50' : 'border-slate-300 hover:border-[--accent]'}`}
                            >
                                <input {...getInputProps()} />
                                {selectedImage ? (
                                    <div className="flex flex-col items-center">
                                        <img src={selectedImage} alt="Preview" className="max-h-64 object-contain rounded-lg shadow-sm mb-4" />
                                        <p className="text-sm text-slate-500">Click or drag to replace image</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-slate-600 font-medium">Drag & drop an image here, or click to select</p>
                                        <p className="text-slate-400 text-sm mt-1">Supports JPG, PNG</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 2. Prompt Section */}
                        <div className="mb-8">
                            <label className="block text-sm font-bold text-slate-700 mb-2">2. Describe your edit</label>
                            <div className="flex gap-4 flex-col sm:flex-row">
                                <input 
                                    type="text" 
                                    value={prompt} 
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="E.g., 'Make it look like a pencil sketch' or 'Add a neon glow'"
                                    className="flex-grow elegant-input"
                                />
                                <button 
                                    onClick={handleGenerate} 
                                    disabled={!selectedImage || !prompt || isLoading}
                                    className="elegant-button whitespace-nowrap min-w-[140px] flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <span className="mr-2">✨</span> Generate
                                        </>
                                    )}
                                </button>
                            </div>
                            {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}
                        </div>

                        {/* 3. Result Section */}
                        {generatedImage && (
                            <div className="border-t border-slate-100 pt-8 animate-fade-in">
                                <label className="block text-sm font-bold text-slate-700 mb-4 text-center">Generated Result</label>
                                <div className="flex justify-center">
                                    <div className="relative group">
                                        <img src={generatedImage} alt="Generated AI Art" className="rounded-xl shadow-2xl max-h-[500px] w-auto border border-slate-200" />
                                        <a 
                                            href={generatedImage} 
                                            download={`nohaw-ai-edit-${Date.now()}.png`}
                                            className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-slate-800 font-semibold py-2 px-4 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity text-sm flex items-center"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            Download
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <div className="pb-16 md:pb-0"></div>
            <Footer />
            <BottomNav />
        </div>
    );
};

export default AIStudioPage;
