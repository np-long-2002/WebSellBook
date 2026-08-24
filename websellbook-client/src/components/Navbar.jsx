import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  FaShoppingCart,
  FaUser,
  FaSearch,
  FaUserShield,
  FaBriefcase
} from "react-icons/fa";

import { jwtDecode } from "jwt-decode";

import {
  useContext,
  useEffect,
  useState
} from "react";

import { CartContext } from "../context/CartContext";
import { getBooks } from "../services/bookService";

function Navbar({ openLogin }) {

  const navigate = useNavigate();

  const { totalItems } =
    useContext(CartContext);

  const token =
    localStorage.getItem("token");

  const [keyword, setKeyword] =
    useState("");

  const [books, setBooks] =
    useState([]);

  const [suggestions, setSuggestions] =
    useState([]);

  let email = "";
let role = "";
let fullName = "";

try {

  if (
    token &&
    token.split(".").length === 3
  ) {

    const decoded =
      jwtDecode(token);

    email =
      decoded[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
      ];

    fullName =
      decoded[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
      ];

    role =
      decoded[
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ];
  }

} catch (error) {

  console.log(
    "Invalid token"
  );




  // localStorage.removeItem(
  //   "token"
  // ); // Đã comment để tránh việc tự động xóa token khi trang load
}

  useEffect(() => {

    const fetchBooks =
      async () => {

        try {

          const data =
            await getBooks();

          setBooks(data);

        } catch (error) {

          console.log(error);

        }
      };

    fetchBooks();

  }, []);

  useEffect(() => {

    if (!keyword.trim()) {

      setSuggestions([]);

      return;
    }

    const result =
      books.filter((book) =>
        book.title
          .toLowerCase()
          .includes(
            keyword.toLowerCase()
          )
      );

    setSuggestions(
      result.slice(0, 6)
    );

  }, [keyword, books]);

  const handleLogout = () => {

    localStorage.removeItem(
      "token"
    );

    navigate("/");

    window.location.reload();
  };

  return (

    <header
      className="
      fixed
      top-4
      left-4
      right-4
      z-50
              rounded-2xl
      bg-white/40
      backdrop-blur-xl
      border
      border-white/40
      shadow-lg
              "
            >

                  <div
                    className="
        max-w-7xl
        mx-auto
        px-6
                      h-16
          flex
          items-center
        justify-between
        gap-8
          "
        >

        {/* LOGO */}

          <Link
            to="/"
            className="
          text-2xl
          font-black
          tracking-tighter
          text-transparent
          bg-clip-text
          bg-gradient-to-r
          from-indigo-600
          to-purple-500
          whitespace-nowrap
            "
          >
          BOOKSTORE.
          </Link>

        {/* SEARCH */}
              <div
                className="
          relative
          flex-1
          max-w-2xl
                "
              >

          <div
                  className="
            flex
            border
            border-white/50
                  rounded-full
            overflow-hidden
            bg-white/50
            focus-within:bg-white
            focus-within:border-indigo-400
                  transition
                  "
                >
            <input
              type="text"
              placeholder="Search books..."
              value={keyword}
              onChange={(e) =>
                setKeyword(
                  e.target.value
                )
              }
                  className="
              flex-1
              px-5
              py-2
              bg-transparent
              outline-none
                  "
            />
              <button
              className="
              bg-indigo-600
              text-white
              px-6
              rounded-r-full
              "
            >
              <FaSearch />
              </button>

          </div>

          {suggestions.length > 0 && (
            <div
              className="
              absolute
              top-full
              left-0
              right-0
              mt-2
              bg-white/80
              backdrop-blur-xl
              border
              border-white/20
              rounded-2xl
              shadow-2xl
              overflow-hidden
              "
            >

              {suggestions.map(
                (book) => (
                  <div
                    key={book.id}
                    onClick={() => {

                      navigate(
                        `/book/${book.id}`
  );

                      setKeyword("");

                      setSuggestions([]);

                    }}
                    className="
                    flex
                    gap-3
                    p-3
                    cursor-pointer
                    hover:bg-blue-50
                    transition
                    "
                  >

                    <img
                      src={book.imageUrl}
                      alt=""
                      className="
                      w-12
                      h-16
                      object-cover
                      rounded
                      "
                    />

                    <div>

                      <p
                        className="
                        font-medium
                        "
                      >
                        {book.title}
                      </p>

                      <p
                        className="
                        text-red-500
                        font-bold
                        "
                      >
                        {book.price?.toLocaleString()}₫
                      </p>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>

        {/* MENU */}

        <div
          className="
          flex
          items-center
          gap-5
          text-gray-700
          font-bold
          "
        >

          <Link
            to="/"
            className="
            hover:text-indigo-600
            transition
            "
          >
            Home
          </Link>

          {token && (

            <>
              <Link
                to="/orders"
                className="
                hover:text-indigo-600
                transition
                "
              >
                Orders
              </Link>

              <Link
                to="/profile"
                className="
                hover:text-indigo-600
                transition
                "
              >
                Profile
              </Link>
            </>

          )}
          <Link
            to="/cart"
            className="
            relative
            text-xl
            hover:text-indigo-600
            transition
            "
          >

            <FaShoppingCart />

            {totalItems > 0 && (

              <span
                className="
                absolute
                -top-2
                -right-3
                bg-red-500
                text-white
                text-[10px]
                rounded-full
                w-4
                h-4
                flex
                items-center
                justify-center
                "
              >
                {totalItems}
              </span>

            )}

          </Link>

          {token ? (

            <>

              <div
                className="
                flex
                flex-col
                text-right
                leading-none
                "
              >

                <span
                  className="
                  text-sm
                  font-semibold
                  "
                >
                  {fullName}
                </span>

                <span
                  className="
                  text-[10px]
                  text-gray-400
                  "
                >
                  {email}
                </span>

              </div>

              {role === "Admin" && (

                <Link
                  to="/admin"
                  className="
                  flex
                  items-center
                  gap-2
                  bg-purple-500/20
                  text-purple-700
                  px-4
                  py-1.5
                  rounded-full
                  hover:bg-purple-500/30
                  transition
                  "
                >
                  <FaUserShield />
                  Admin
                </Link>

              )}

              {role === "Staff" && (

                <Link
                  to="/staff"
                  className="
                  flex
                  items-center
                  gap-2
                  bg-emerald-500/20
                  text-emerald-700
                  px-4
                  py-1.5
                  rounded-full
                  hover:bg-emerald-500/30
                  transition
                  "
                >
                  <FaBriefcase />
                  Staff
                </Link>

              )}

              <button
                onClick={
                  handleLogout
}
                className="
                text-gray-500
                hover:text-red-500
                transition
                "
              >
                Logout
              </button>

            </>

          ) : (

            <button
              onClick={
                openLogin
              }
              className="
              bg-indigo-600
              text-white
              px-5
              py-1.5
              rounded-full
              flex
              items-center
              gap-2
              hover:bg-indigo-700
              hover:scale-105
              transition-all
              "
            >
              <FaUser />
              Login
            </button>

          )}

        </div>

      </div>

    </header>

  );
}

export default Navbar;

