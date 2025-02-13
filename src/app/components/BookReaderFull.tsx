/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState,  useEffect } from "react";
import type { Contents } from "epubjs";
import {
  ReactReader,
  ReactReaderStyle,
  type IReactReaderStyle,
} from "react-reader";
import { Book } from "@/types";
import { useRouter } from "next/navigation";
import {
  auth,
  getLastPosition,
  saveLastPosition,
  saveOpenedBook,
  trackReadingTime,
} from "../lib/firebase";
import { useSubscription } from "../hooks/useSubscription";
import { Icon } from "@iconify/react";
import Loader from "./Loader";

const BookReaderFull = ({ book }: { book: Book }) => {
  const [user, setUser] = useState(auth.currentUser);
  const [location, setLocation] = useState<string | null>(null);


  const [startTime, setStartTime] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);



  const { subscription, loading: subLoading } = useSubscription(user?.uid || null);
  const { slug, title } = book;
  const router = useRouter();

  const bookUrl = `/files/${slug}.epub`;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    const checkSubscription = async () => {
      if (!user || subLoading) return; // Wait for user & subscription to load

      if (subscription) {
        const lastPos = await getLastPosition(user.uid, slug);
        if (lastPos) setLocation(lastPos);
        setLoading(false);
        // Track reading start time
        setStartTime(Date.now());

        // Save opened book to history
        await saveOpenedBook(user.uid, slug);
      }
   
    };

    checkSubscription();

    return () => {
      // When user leaves, save reading time
      if (startTime) {
        if (user) {
          const duration = Math.floor((Date.now() - startTime) / 1000); // in seconds
          trackReadingTime(user.uid, slug, duration);
        }
      }

      unsubscribe();
    };
  }, [subscription, user]);

  const handleLocationChange = (epubcfi: string) => {
    setLocation(epubcfi);

    if (user) {
      saveLastPosition(user.uid, slug, epubcfi);
    }

  };

  if (loading || !user || subLoading) {
    return <Loader />
  }
  

  
  return (
    <div className="w-full h-full border border-stone-300 rounded overflow-hidden">
      {/* Subscription Prompt */}
   
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
            showToc={subscription ? true : false}
            swipeable={true}
            epubOptions={{
              allowPopups: true, // Adds `allow-popups` to sandbox-attribute
              allowScriptedContent: true, // Adds `allow-scripts` to sandbox-attribute
            }}
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
export default BookReaderFull;
