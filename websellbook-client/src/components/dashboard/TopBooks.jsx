function TopBooks({
  books
}) {

  return (

    <div
      className="
      bg-white
      rounded-2xl
      border
      shadow-sm
      p-6
      "
    >

      <h2
        className="
        text-xl
        font-bold
        mb-4
        "
      >
        Best Selling Books
      </h2>

      {books.map(book => (

        <div
          key={book.id}
          className="
          flex
          justify-between
          py-3
          border-b
          "
        >
          <span>
            {book.title}
          </span>

          <span>
            {book.sold}
          </span>
        </div>

      ))}

    </div>

  );
}

export default TopBooks;