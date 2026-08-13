import {
  FaHome,
  FaBook,
  FaFolder,
  FaPenFancy,
  FaShoppingCart,
  FaUsers,
  FaSignOutAlt,
  FaTicketAlt,
  FaTags
} from "react-icons/fa";
import {
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";

import {
  useEffect,
  useState
} from "react";

import {
  getDashboard
} from "../services/dashboardService";

function AdminSidebar() {

  const location = useLocation();
  const navigate = useNavigate();

  const [pendingOrders, setPendingOrders] =
    useState(0);

  const [activeVouchers, setActiveVouchers] =
    useState(0);

  useEffect(() => {

    loadNotification();

    const interval =
      setInterval(loadNotification, 30000);

    return () => clearInterval(interval);

  }, []);

  const loadNotification = async () => {

    try {

      const data =
        await getDashboard();

      setPendingOrders(
        data.pendingOrders ?? 0
      );

      setActiveVouchers(
        data.activeVouchers ?? 0
      );

    }
    catch (err) {

      console.log(err);

    }

  };

  const menus = [
    {
      name: "Dashboard",
      icon: <FaHome />,
      path: "/admin"
    },
    {
      name: "Books",
      icon: <FaBook />,
      path: "/admin/books"
    },
    {
      name: "Categories",
      icon: <FaFolder />,
      path: "/admin/categories"
    },
    {
      name: "Authors",
      icon: <FaPenFancy />,
      path: "/admin/authors"
    },
    {
      name: "Orders",
      icon: <FaShoppingCart />,
      path: "/admin/orders"
    },
    {
      name: "Users",
      icon: <FaUsers />,
      path: "/admin/users"
    },
    {
      name: "Vouchers",
      icon: <FaTicketAlt />,
      path: "/admin/vouchers"
    },
    {
      name: "Promotions",
      icon: <FaTags />,
      path: "/admin/promotions"
    }
  ];

  const logout = () => {

    localStorage.clear();

    navigate("/");

  };

  return (

    <aside className="w-72 bg-slate-900 text-white flex flex-col shadow-2xl">

      <div className="p-6 border-b border-slate-700">

        <h1 className="text-2xl font-bold">
          📚 BookStore
        </h1>

        <p className="text-slate-400 text-sm">
          Admin Panel
        </p>

      </div>

      <nav className="flex-1 p-4">

        {menus.map(item => {

          const active =
            location.pathname === item.path;

          return (

            <Link
              key={item.path}
              to={item.path}
              className={`
              flex
              items-center
              justify-between
              p-3
              rounded-xl
              mb-2
              transition
              ${active
                  ? "bg-blue-600 shadow-lg"
                  : "hover:bg-slate-800"
                }
              `}
            >

              <div className="flex items-center gap-3">

                <span className="text-lg">
                  {item.icon}
                </span>

                <span>
                  {item.name}
                </span>

              </div>

              {
                item.name === "Orders" &&
                pendingOrders > 0 && (
                  <span
                    className="
      bg-red-500
      text-white
      text-xs
      font-bold
      rounded-full
      min-w-[24px]
      h-6
      flex
      items-center
      justify-center
      "
                  >
                    {pendingOrders}
                  </span>
                )
              }

              {
                item.name === "Vouchers" &&
                activeVouchers > 0 && (
                  <span
                    className="
      bg-green-500
      text-white
      text-xs
      font-bold
      rounded-full
      min-w-[24px]
      h-6
      flex
      items-center
      justify-center
      "
                  >
                    {activeVouchers}
                  </span>
                )
              }

            </Link>

          );

        })}

      </nav>

      <div className="p-4 border-t border-slate-700">

        <button
          onClick={logout}
          className="
          w-full
          bg-red-500
          hover:bg-red-600
          py-3
          rounded-xl
          flex
          items-center
          justify-center
          gap-2
          transition
          "
        >

          <FaSignOutAlt />

          Logout

        </button>

      </div>

    </aside>

  );

}

export default AdminSidebar;