import BookDetails from "@/app/components/BookDetails";
import { books } from "@/app/data";


export default async function BookDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>
  }) {
  
  const slug = (await params).slug

  
  const book = books.find((book)=>book.slug===slug)

  return (
    book ?
      <BookDetails book={book}  /> :null
  );
}
