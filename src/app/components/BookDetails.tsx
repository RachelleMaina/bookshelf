/* eslint-disable @next/next/no-img-element */
"use client";

import { Book } from "@/types";
import { useRouter } from "next/navigation";

export default function BookDetails({ book }: { book: Book }) {
  const router = useRouter();
  const { coverUrl, title, slug, description } = book;

  return (
    <div className="bg-[#FFFBEF] text-[#39210C] h-full p-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4 w-full">
          <img
            src={`/covers/${coverUrl}`}
            className="w-full object-cover rounded-lg"
            alt={`${coverUrl}`}
          />
        </div>
        <div className="md:w-3/4 w-full">
          <h1 className="text-md font-bold">{title}</h1>
          <div className="md:w-1/4 w-full my-4">
                <button
                  onClick={() => router.push(`/reader/${slug}`)}
                  className="w-full px-2 py-2 bg-[#904500] text-white text-xs font-medium rounded hover:bg-[#E57712] transition duration-200"
                >
                  Start Reading
                </button>
              </div>
          <div className="flex flex-col gap-4">
            <div>
              <div className="mb-4">
                <h2 className="font-semibold text-sm">Description</h2>
                <div className="text-sm">{description}</div>
              </div>
              <div>
                <h2 className="text-sm font-semibold">Credits</h2>
                <div className="text-sm font-medium">
                  <p>Author: Rachel Maina</p>
                  <p>Editor: Ian Njuguna</p>
                </div>
              </div>
            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
