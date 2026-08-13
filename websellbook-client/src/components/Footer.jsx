function Footer() {
  return (
    <footer
      className="
      bg-slate-900
      text-white
      mt-16
      "
    >
      <div
        className="
        max-w-7xl
        mx-auto
        px-6
        py-12
        grid
        md:grid-cols-4
        gap-8
        "
      >
        <div>
          <h2
            className="
            text-2xl
            font-bold
            mb-4
            "
          >
            📚 BookStore
          </h2>

          <p className="text-slate-300">
            Discover thousands of books
            from all categories.
          </p>
        </div>

        <div>
          <h3
            className="
            font-semibold
            mb-4
            "
          >
            Information
          </h3>

          <ul className="space-y-2 text-slate-300">
            <li>About Us</li>
            <li>Contact</li>
            <li>Careers</li>
          </ul>
        </div>

        <div>
          <h3
            className="
            font-semibold
            mb-4
            "
          >
            Customer Service
          </h3>

          <ul className="space-y-2 text-slate-300">
            <li>Shipping Policy</li>
            <li>Return Policy</li>
            <li>FAQ</li>
          </ul>
        </div>

        <div>
          <h3
            className="
            font-semibold
            mb-4
            "
          >
            Contact
          </h3>

          <p className="text-slate-300">
            Email:
            support@bookstore.com
          </p>

          <p className="text-slate-300">
            Phone:
            0123 456 789
          </p>
        </div>
      </div>

      <div
        className="
        border-t
        border-slate-700
        text-center
        py-4
        text-slate-400
        "
      >
        © 2026 BookStore. All rights
        reserved.
      </div>
    </footer>
  );
}

export default Footer;