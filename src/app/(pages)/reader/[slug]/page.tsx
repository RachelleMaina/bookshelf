import BookReader from "@/app/components/BookReader"
import { books } from "@/app/data"


export default async function BookReaderPage({
  params,
}: {
  params: Promise<{ slug: string }>
  }) {
  
  const slug = (await params).slug

   const book = books.find((book)=>book.slug===slug)



  return (
  book ?  <BookReader book={book}/>:null
  )
}
