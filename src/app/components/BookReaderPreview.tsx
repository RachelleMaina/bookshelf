/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Book } from "@/types";
import { Icon } from "@iconify/react";
import type { Contents } from "epubjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ReactReader,
  ReactReaderStyle,
  type IReactReaderStyle,
} from "react-reader";

const BookReaderPreview = ({ book }: { book: Book }) => {

  const [location, setLocation] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSubscribePrompt, setShowSubscribePrompt] = useState(false);


  const PREVIEW_LIMIT = 10; // Limit to 10 pages for free preview

  const { slug, title } = book;
  const router = useRouter();

  const bookUrl = `/files/${slug}.epub`;



  const handleLocationChange = (epubcfi: string) => {
    setLocation(epubcfi);
    setCurrentPage((newPage) => newPage + 1);

  
    // If preview limit is reached and not subscribed, show message
    if (currentPage > PREVIEW_LIMIT) {
      setShowSubscribePrompt(true);
    }
  };


  
  return (
    <div className="w-full h-full border border-stone-300 rounded overflow-hidden">
      {/* Subscription Prompt */}
      {showSubscribePrompt  ? (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="text-center text-white p-8 max-w-lg">
            <h1 className="text-2xl font-bold mb-4">
              Enjoy free previews, subscribe for full access.
            </h1>
            <p className="text-lg mb-6">
              Start from where you left off. Starts at{" "}
              <span className="font-bold">KES 60</span>.
            </p>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => router.push("/subscribe")}
                className="w-full bg-[#904500] hover:bg-[#E57712] text-white font-semibold py-3 rounded-lg text-lg"
              >
                Subscribe Now
              </button>
              <button
                onClick={() => router.back()}
                className="text-white text-sm font-semibold py-3 rounded-lg text-l border border-[#904500]"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative h-screen">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="fixed top-16 left-2 md:left-4 flex items-center gap-2 p-1 bg-white shadow-lg rounded-full text-black  transition z-50"
            style={{ transform: "translateX(-10%)" }}
          >
            <Icon icon="mdi:arrow-left" className="text-xl" />
          </button>

          <ReactReader
            url={bookUrl}
            title={title}
            location={location}
            locationChanged={handleLocationChange}
            showToc={ false}
            swipeable={true}
            readerStyles={darkReaderTheme}
            getRendition={(_rendition) => {
              if (location) {
                _rendition.display(location); // Restore saved CFI
          }
               
              _rendition.hooks.content.register((contents: Contents) => {
                const document = contents.window.document;

                if (document) {
                  const css = `
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
              body {
                font-family: 'Roboto', sans-serif !important;
                font-size: 16px !important;
                line-height: 1.6 !important;
              }
                `;
                  const style = document.createElement("style");
                  style.appendChild(document.createTextNode(css));
                  document.head.appendChild(style);
                  _rendition.themes.override("color", "#fff");
                  _rendition.themes.override("background", "#000");
                }
              });
            }}
          />
        </div>
      )}
    </div>
  );
};
const darkReaderTheme: IReactReaderStyle = {
  ...ReactReaderStyle,
  arrow: {
    ...ReactReaderStyle.arrow,
    color: "white",
  },
  arrowHover: {
    ...ReactReaderStyle.arrowHover,
    color: "#ccc",
  },
  readerArea: {
    ...ReactReaderStyle.readerArea,
    backgroundColor: "#000",
    transition: undefined,
  },
  titleArea: {
    ...ReactReaderStyle.titleArea,
    color: "#ccc",
  },
  tocArea: {
    ...ReactReaderStyle.tocArea,
    background: "#111",
  },
  tocButtonExpanded: {
    ...ReactReaderStyle.tocButtonExpanded,
    background: "#222",
  },
  tocButtonBar: {
    ...ReactReaderStyle.tocButtonBar,
    background: "#fff",
  },
  tocButton: {
    ...ReactReaderStyle.tocButton,
    color: "white",
  },
};
export default BookReaderPreview;
