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

  localStorage.removeItem(
    "token"
  );
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
      sticky
      top-0
      z-50
      bg-white
      shadow-md
      "
    >

      <div
        className="
        max-w-7xl
        mx-auto
        px-6
        h-20
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
          text-3xl
          font-extrabold
          text-blue-600
          whitespace-nowrap
          "
        >
          📚 BookStore
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
            border-2
            border-blue-500
            rounded-full
            overflow-hidden
            bg-white
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
              py-3
              outline-none
              "
            />

            <button
              className="
              bg-blue-600
              text-white
              px-6
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
              bg-white
              rounded-2xl
              shadow-xl
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
                    hover:bg-slate-100
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
          "
        >

          <Link
            to="/"
            className="
            hover:text-blue-600
            "
          >
            Home
          </Link>

          {token && (

            <>
              <Link
                to="/orders"
                className="
      hover:text-blue-600
      "
              >
                My Orders
              </Link>

              <Link
                to="/profile"
                className="
      hover:text-blue-600
      "
              >
                My Profile
              </Link>
            </>

          )}
          <Link
            to="/cart"
            className="
            relative
            text-xl
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
                text-xs
                rounded-full
                w-5
                h-5
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
                  text-xs
                  text-gray-500
                  "
                >
                  {email}
                </span>

                <span
                  className="
                  text-xs
                  text-blue-600
                  font-semibold
                  "
                >
                  {role}
                </span>

              </div>

              {role === "Admin" && (

                <Link
                  to="/admin"
                  className="
                  flex
                  items-center
                  gap-2
                  bg-purple-600
                  text-white
                  px-4
                  py-2
                  rounded-xl
                  hover:bg-purple-700
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
                  bg-green-600
                  text-white
                  px-4
                  py-2
                  rounded-xl
                  hover:bg-green-700
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
                bg-red-500
                text-white
                px-4
                py-2
                rounded-xl
                hover:bg-red-600
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
              bg-blue-600
              text-white
              px-4
              py-2
              rounded-xl
              flex
              items-center
              gap-2
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

