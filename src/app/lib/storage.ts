export function saveProgressLocally(bookId: string, lastLocation: string) {
    const progress = JSON.parse(localStorage.getItem("readingProgress") || "{}");
    progress[bookId] = lastLocation;
    localStorage.setItem("readingProgress", JSON.stringify(progress));
  }
  
  export function getProgressLocally(bookId: string) {
    const progress = JSON.parse(localStorage.getItem("readingProgress") || "{}");
    return progress[bookId] || null;
  }
  