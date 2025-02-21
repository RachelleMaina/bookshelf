/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import { books } from "../data";
import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import { auth, getOpenedBooks } from "../lib/firebase";
import Loader from "./Loader";

const Books = () => {
  const [currentlyReading, setCurrentlyReading] = useState<any>([]);
  const [allBooks, setAllBooks] = useState<any>(books);

  const [user, setUser] = useState(auth.currentUser);

  const router = useRouter();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchBooks = async () => {
      try {
        const openedBookIds = await getOpenedBooks(user.uid); // Fetch opened books from Firestore

        // Filter books into categories
        const currentlyReading = books.filter((book) =>
          openedBookIds.includes(book.slug)
        );
        const otherBooks = books.filter(
          (book) => !openedBookIds.includes(book.slug)
        );

        setCurrentlyReading(currentlyReading);
        setAllBooks(otherBooks);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, [user]);

  return (
    <div className="bg-[#FFFBEF] text-[#39210C]">
      <Navbar />

      {books ? (
        <>
          <div className="max-w-xl text-center lg:text-left">
            <div className="px-8 py-8">
              <h1 className="text-lg font-bold">
                Welcome to Ray&apos;s Bookshelf
              </h1>
              <p className="mt-4">
                Enjoy full access to all our books with a one-time subscription.
                Your access ends when your current period is over, no automatic
                charges. You decide when to renew!
              </p>
            </div>
          </div>
          {currentlyReading.length > 0 && (
            <div className="bg-[#F2EEE3] px-8 py-8">
              <h1 className="text-md font-bold">Currently Reading</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 px-8  ">
                {currentlyReading.map((book: any) => (
                  <div
                    key={book.id}
                    onClick={() => router.push(`/reader/${book.slug}`)}
                    className="cursor-pointer flex flex-col items-center py-4 space-y-2"
                  >
                    <img
                      src={`/covers/${book.coverUrl}`}
                      className="w-full object-cover rounded-lg"
                      alt={`${book.coverUrl}`}
                    />
                    <div className="h-16 space-y-1 w-full">
                      <h2 className="text-sm text-left font-semibold  line-clamp-2">
                        {book.title}
                      </h2>
                      <p className="text-xs text-left line-clamp-1">
                        Rachel Maina
                      </p>
                    </div>

                    <div className=" w-full flex justify-start ">
                      <button className="px-2 py-2 bg-[#904500] text-white text-xs font-medium rounded hover:bg-[#E57712] transition duration-200">
                        Continue Reading
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {allBooks.length > 0 && <div className="h-10 bg-[#FFFBEF]"></div>}
          <div className="bg-[#F2EEE3] px-8 py-8">
            <h1 className="text-md font-bold">All Books</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 px-8  ">
              {allBooks.map((book: any) => (
                <div
                  key={book.id}
                  onClick={() => router.push(`/books/${book.slug}`)}
                  className="cursor-pointer flex flex-col items-center py-4 space-y-2"
                >
                  <img
                    src={`/covers/${book.coverUrl}`}
                    className="w-full object-cover rounded-lg"
                    alt={`${book.coverUrl}`}
                  />
                  <div className="h-16 space-y-1 w-full">
                    <h2 className="text-sm md:text-left text-center font-semibold line-clamp-2">
                      {book.title}
                    </h2>
                    <p className="text-xs md:text-left text-center  line-clamp-1">
                      Rachel Maina
                    </p>
                  </div>

                  <div className="w-full flex md:justify-start justify-center">
                    <button className="px-2 py-2 bg-[#904500] text-white text-xs font-medium rounded hover:bg-[#E57712] transition duration-200">
                      Start Reading
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};
export default Books;
