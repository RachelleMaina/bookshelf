/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Book } from "@/types";
import { useEffect, useState } from "react";
import { useSubscription } from "../hooks/useSubscription";
import { auth } from "../lib/firebase";
import BookReaderFull from "./BookReaderFull";
import BookReaderPreview from "./BookReaderPreview";

const BookReader = ({ book }: { book: Book }) => {
  const [user, setUser] = useState(auth.currentUser);

  const { subscription } = useSubscription(user?.uid || null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => {
      unsubscribe();
    };
  }, [subscription, user]);

  return user && subscription ? (
    <BookReaderFull book={book} />
  ) : (
    <BookReaderPreview book={book} />
  );
};

export default BookReader;
