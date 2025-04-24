"use client";

import { useState, useRef, useEffect } from "react";
import { MemeTemplate, PexelsImage, MemeText } from "@/lib/types";
import { calculateStrokeWidth, downloadMeme, generateTextShadow } from "@/lib/utils";
import { memeTemplates } from "@/lib/data/templates";

export default function MemeEditor() {
  // State for the meme
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplate | null>(null);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [topText, setTopText] = useState("TOP TEXT");
  const [bottomText, setBottomText] = useState("BOTTOM TEXT");
  const [fontSize, setFontSize] = useState(36);
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [strokeWidth, setStrokeWidth] = useState(2);
  
  // State for modals
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  // State for search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PexelsImage[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // State for text generation
  const [textPrompt, setTextPrompt] = useState("");
  const [textSuggestions, setTextSuggestions] = useState<MemeText[]>([]);
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  
  // Refs
  const memeCanvasRef = useRef<HTMLDivElement>(null);
  
  // Effect to update stroke width when font size changes
  useEffect(() => {
    setStrokeWidth(calculateStrokeWidth(fontSize));
  }, [fontSize]);
  
  // Select a template
  const handleSelectTemplate = (template: MemeTemplate) => {
    setSelectedTemplate(template);
    setCustomImage(null);
    setIsTemplateModalOpen(false);
  };
  
  // Search for images
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setSearchResults([]);
    
    try {
      const response = await fetch(`/api/pexels?query=${encodeURIComponent(searchQuery)}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setSearchResults(data.photos || []);
    } catch (error) {
      console.error("Error searching for images:", error);
    } finally {
      setIsSearching(false);
    }
  };
  
  // Select an image from search results
  const handleSelectImage = (image: PexelsImage) => {
    setCustomImage(image.src.large);
    setSelectedTemplate(null);
    setIsSearchModalOpen(false);
  };
  
  // Generate meme text
  const handleGenerateText = async () => {
    if (!textPrompt.trim()) return;
    
    setIsGeneratingText(true);
    setTextSuggestions([]);
    
    try {
      const response = await fetch("/api/groq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: textPrompt }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setTextSuggestions(data.suggestions || []);
    } catch (error) {
      console.error("Error generating text:", error);
    } finally {
      setIsGeneratingText(false);
    }
  };
  
  // Apply a text suggestion
  const handleApplyTextSuggestion = (suggestion: MemeText) => {
    setTopText(suggestion.top);
    setBottomText(suggestion.bottom);
    setIsTextModalOpen(false);
  };
  
  // Download the meme
  const handleDownload = () => {
    if (memeCanvasRef.current) {
      downloadMeme("meme-canvas", "my-meme.png");
    }
  };
  
  // Share the meme
  const handleShare = (platform: "twitter" | "facebook" | "reddit") => {
    // Implementation will be in the shareMeme utility function
    alert(`Sharing to ${platform} is not implemented in this demo.`);
    setIsShareModalOpen(false);
  };
  
  // Get the current image URL
  const currentImageUrl = customImage || (selectedTemplate?.imageUrl) || "/placeholder.jpg";
  
  // Text style based on current settings
  const textStyle = {
    fontSize: `${fontSize}px`,
    color: textColor,
    textShadow: generateTextShadow(strokeWidth),
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="card mb-6">
        <div className="flex flex-wrap gap-3 mb-4">
          <button
            className="btn btn-primary"
            onClick={() => setIsTemplateModalOpen(true)}
          >
            <span className="mr-2">🖼️</span> Choose Template
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setIsSearchModalOpen(true)}
          >
            <span className="mr-2">🔍</span> Search Images
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setIsTextModalOpen(true)}
          >
            <span className="mr-2">✨</span> Generate Text
          </button>
        </div>
        
        <div className="flex justify-center mb-6">
          <div
            id="meme-canvas"
            ref={memeCanvasRef}
            className="relative bg-black rounded-lg overflow-hidden shadow-xl"
            style={{ maxWidth: "500px", width: "100%" }}
          >
            <div
              className="meme-text top-2"
              style={textStyle}
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => setTopText(e.currentTarget.textContent || "")}
            >
              {topText}
            </div>
            
            <div className="w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentImageUrl}
                alt="Meme"
                className="w-full h-auto"
              />
            </div>
            
            <div
              className="meme-text bottom-2"
              style={textStyle}
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => setBottomText(e.currentTarget.textContent || "")}
            >
              {bottomText}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex flex-col">
            <label htmlFor="font-size" className="mb-1 text-sm opacity-70">
              Font Size: {fontSize}px
            </label>
            <input
              type="range"
              id="font-size"
              min="12"
              max="72"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full h-2 bg-[var(--surface-2)] rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="text-color" className="mb-1 text-sm opacity-70">
              Text Color
            </label>
            <input
              type="color"
              id="text-color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-full h-10 bg-[var(--surface-2)] rounded-lg cursor-pointer"
            />
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="stroke-width" className="mb-1 text-sm opacity-70">
              Stroke Width: {strokeWidth}px
            </label>
            <input
              type="range"
              id="stroke-width"
              min="0"
              max="10"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
              className="w-full h-2 bg-[var(--surface-2)] rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          <button
            className="btn btn-secondary"
            onClick={handleDownload}
          >
            <span className="mr-2">💾</span> Download
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setIsShareModalOpen(true)}
          >
            <span className="mr-2">📤</span> Share
          </button>
        </div>
      </div>
      
      {/* Template Modal */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--surface)] rounded-lg w-full max-w-3xl max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-[var(--surface-2)]">
              <h2 className="text-xl font-bold">Choose a Template</h2>
              <button
                onClick={() => setIsTemplateModalOpen(false)}
                className="text-2xl hover:text-[var(--accent)]"
              >
                &times;
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-4rem)]">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {memeTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="cursor-pointer rounded-lg overflow-hidden border-2 border-transparent hover:border-[var(--primary)] transition-all hover:scale-105"
                    onClick={() => handleSelectTemplate(template)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={template.imageUrl}
                      alt={template.name}
                      className="w-full h-auto"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Search Modal */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--surface)] rounded-lg w-full max-w-3xl max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-[var(--surface-2)]">
              <h2 className="text-xl font-bold">Search Images</h2>
              <button
                onClick={() => setIsSearchModalOpen(false)}
                className="text-2xl hover:text-[var(--accent)]"
              >
                &times;
              </button>
            </div>
            <div className="p-4">
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for images..."
                  className="input flex-1"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button
                  className="btn btn-primary"
                  onClick={handleSearch}
                  disabled={isSearching}
                >
                  {isSearching ? "Searching..." : "Search"}
                </button>
              </div>
              
              <div className="overflow-y-auto max-h-[calc(80vh-10rem)]">
                {isSearching ? (
                  <div className="text-center py-8">Searching...</div>
                ) : searchResults.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {searchResults.map((image) => (
                      <div
                        key={image.id}
                        className="cursor-pointer rounded-lg overflow-hidden border-2 border-transparent hover:border-[var(--primary)] transition-all hover:scale-105"
                        onClick={() => handleSelectImage(image)}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image.src.medium}
                          alt={image.alt}
                          className="w-full h-auto"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    {searchQuery ? "No results found" : "Search for images to get started"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Text Generation Modal */}
      {isTextModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--surface)] rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-[var(--surface-2)]">
              <h2 className="text-xl font-bold">Generate Meme Text</h2>
              <button
                onClick={() => setIsTextModalOpen(false)}
                className="text-2xl hover:text-[var(--accent)]"
              >
                &times;
              </button>
            </div>
            <div className="p-4">
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={textPrompt}
                  onChange={(e) => setTextPrompt(e.target.value)}
                  placeholder="Describe your meme context..."
                  className="input flex-1"
                  onKeyDown={(e) => e.key === "Enter" && handleGenerateText()}
                />
                <button
                  className="btn btn-primary"
                  onClick={handleGenerateText}
                  disabled={isGeneratingText}
                >
                  {isGeneratingText ? "Generating..." : "Generate"}
                </button>
              </div>
              
              <div className="overflow-y-auto max-h-[calc(80vh-10rem)]">
                {isGeneratingText ? (
                  <div className="text-center py-8">Generating text...</div>
                ) : textSuggestions.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {textSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="bg-[var(--surface-2)] p-3 rounded-lg cursor-pointer hover:bg-opacity-80 transition-all"
                        onClick={() => handleApplyTextSuggestion(suggestion)}
                      >
                        <div className="font-bold">Top: {suggestion.top}</div>
                        <div className="font-bold">Bottom: {suggestion.bottom}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    {textPrompt ? "No suggestions generated" : "Describe your meme to generate text"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--surface)] rounded-lg w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-[var(--surface-2)]">
              <h2 className="text-xl font-bold">Share Your Meme</h2>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="text-2xl hover:text-[var(--accent)]"
              >
                &times;
              </button>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  className="btn py-4 text-white bg-[#1DA1F2] hover:bg-opacity-90"
                  onClick={() => handleShare("twitter")}
                >
                  <span className="mr-2">🐦</span> Twitter
                </button>
                <button
                  className="btn py-4 text-white bg-[#4267B2] hover:bg-opacity-90"
                  onClick={() => handleShare("facebook")}
                >
                  <span className="mr-2">📘</span> Facebook
                </button>
                <button
                  className="btn py-4 text-white bg-[#FF4500] hover:bg-opacity-90"
                  onClick={() => handleShare("reddit")}
                >
                  <span className="mr-2">👽</span> Reddit
                </button>
                <button
                  className="btn py-4 text-white bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] hover:bg-opacity-90"
                  onClick={() => alert("Instagram sharing requires the mobile app")}
                >
                  <span className="mr-2">📷</span> Instagram
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
