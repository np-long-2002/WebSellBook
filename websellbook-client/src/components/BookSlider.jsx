import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import BookCard from "./BookCard";

function BookSlider({ title, books = [] }) {
  const sliderRef = useRef(null);

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({
      left: -1000,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({
      left: 1000,
      behavior: "smooth",
    });
  };

  return (
    <section className="mb-12">

      <div className="flex items-center justify-between mb-4">

        <h2 className="text-2xl font-bold text-slate-800">
          {title}
        </h2>

        <div className="flex gap-2">

          <button
            onClick={scrollLeft}
            className="
              w-10
              h-10
              rounded-full
              bg-white
              shadow
              hover:bg-slate-100
              flex
              items-center
              justify-center
            "
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={scrollRight}
            className="
              w-10
              h-10
              rounded-full
              bg-white
              shadow
              hover:bg-slate-100
              flex
              items-center
              justify-center
            "
          >
            <ChevronRight size={20} />
          </button>

        </div>

      </div>

      <div
        ref={sliderRef}
        className="
          flex
          gap-5
          overflow-x-auto
          scroll-smooth
          pb-2
          no-scrollbar
        "
      >
        {books.map((book) => (
          <div
            key={book.id}
            className="min-w-[230px]"
          >
            <BookCard book={book} />
          </div>
        ))}
      </div>

    </section>
  );
}

export default BookSlider;