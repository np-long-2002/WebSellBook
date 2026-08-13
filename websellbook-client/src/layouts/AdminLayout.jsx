import {
  Outlet,
  NavLink,
  useNavigate
} from "react-router-dom";
import { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboardService";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ShoppingCart,
  Tags,
  PenSquare,
  LogOut,
  Bell,
  Search,
  Ticket,
  BadgePercent
} from "lucide-react";

function AdminLayout() {

  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.clear();

    navigate("/login");
  };
  const [pendingOrders, setPendingOrders] = useState(0);

  const loadNotification = async () => {
    try {
      const data = await getDashboard();

      console.log("Dashboard:", data);

      setPendingOrders(
        data.pendingOrders ??
        data.PendingOrders ??
        0
      );
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {

    loadNotification();

    const interval = setInterval(() => {
      loadNotification();
    }, 30000);

    return () => clearInterval(interval);

  }, []);
  const user =
    JSON.parse(
      localStorage.getItem("user")
    ) || {};

  return (
    <div className="flex h-screen bg-slate-100">

      {/* SIDEBAR */}

      <aside
        className="
        w-[280px]
        bg-gradient-to-b
        from-[#081225]
        to-[#112240]
        text-white
        flex
        flex-col
        shadow-2xl
        "
      >

        {/* LOGO */}

        <div
          className="
          h-24
          px-8
          flex
          items-center
          border-b
          border-slate-700
          "
        >

          <div>

            <h1
              className="
              text-3xl
              font-black
              tracking-wide
              "
            >
              WebSellBook
            </h1>

            <p className="text-slate-400 text-sm">
              Admin Management
            </p>

          </div>

        </div>


        {/* MENU */}

        <div
          className="
          flex-1
          px-5
          space-y-2
          "
        >

          <MenuItem
            to="/admin"
            icon={<LayoutDashboard size={20} />}
            title="Dashboard"
          />

          <MenuItem
            to="/admin/books"
            icon={<BookOpen size={20} />}
            title="Books"
          />

          <MenuItem
            to="/admin/categories"
            icon={<Tags size={20} />}
            title="Categories"
          />

          <MenuItem
            to="/admin/authors"
            icon={<PenSquare size={20} />}
            title="Authors"
          />

          <MenuItem
            to="/admin/orders"
            icon={<ShoppingCart size={20} />}
            title="Orders"
          />

          <MenuItem
            to="/admin/users"
            icon={<Users size={20} />}
            title="Users"
          />
          <MenuItem
            to="/admin/vouchers"
            icon={<Ticket size={20} />}
            title="Vouchers"
          />
        <MenuItem
  to="/admin/promotions"
  icon={<BadgePercent size={20} />}
  title="Promotions"
/>

        </div>

        {/* LOGOUT */}

        <div
          className="
          p-5
          border-t
          border-slate-700
          "
        >

          <button
            onClick={handleLogout}
            className="
            w-full
            flex
            items-center
            justify-center
            gap-3
            py-3
            rounded-xl
            bg-red-500
            hover:bg-red-600
            transition
            font-semibold
            "
          >

            <LogOut size={18} />

            Logout

          </button>

        </div>

      </aside>

      {/* MAIN */}

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* HEADER */}

        <header
          className="
          h-24
          bg-white/90
          backdrop-blur-xl
          border-b
          px-8
          flex
          items-center
          justify-between
          sticky
          top-0
          z-20
          "
        >

          <div>

            <h1
              className="
              text-3xl
              font-bold
              text-slate-800
              "
            >
              Dashboard
            </h1>

            <p className="text-slate-500">
              Welcome back 👋
            </p>

          </div>

          <div
            className="
            flex
            items-center
            gap-5
            "
          >

            {/* SEARCH */}

            <div
              className="
              relative
              "
            >

              <Search
                size={18}
                className="
                absolute
                left-3
                top-3
                text-gray-400
                "
              />

              <input
                type="text"
                placeholder="Search..."
                className="
                pl-10
                pr-4
                py-3
                w-[300px]
                rounded-xl
                border
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                "
              />

            </div>

            {/* NOTIFICATION */}

            <button
              onClick={() => navigate("/admin/orders")}
              className="
    relative
    bg-slate-100
    p-3
    rounded-xl
    hover:bg-slate-200
    "
            >

              <Bell size={22} />

              {pendingOrders > 0 && (

                <>

                  <span
                    className="
                absolute
                -top-1
                -right-1
                bg-red-500
                text-white
                rounded-full
                text-xs
                min-w-[22px]
                h-[22px]
                flex
                items-center
                justify-center
                font-bold
                "
                  >
                    {pendingOrders}
                  </span>

                  <span
                    className="
                absolute
                top-2
                right-2
                w-3
                h-3
                bg-red-500
                rounded-full
                animate-ping
                "
                  />

                </>

              )}

            </button>

            {/* USER */}

            <div
              className="
              flex
              items-center
              gap-3
              "
            >

              <img
                src="https://i.pravatar.cc/150"
                alt=""
                className="
                w-12
                h-12
                rounded-full
                border-2
                border-blue-500
                "
              />

              <div>

                <h4 className="font-semibold">
                  {user.fullName ||
                    "Administrator"}
                </h4>

                <p
                  className="
                  text-sm
                  text-slate-500
                  "
                >
                  Admin
                </p>

              </div>

            </div>

          </div>

        </header>

        {/* CONTENT */}

        <main
          className="
          flex-1
          overflow-y-auto
          p-8
          "
        >

          <Outlet />

        </main>

      </div>

    </div>
  );
}

function MenuItem({
  to,
  icon,
  title
}) {

  return (
    <NavLink
      to={to}
      end={to === "/admin"}
      className={({ isActive }) =>
        `
        flex
        items-center
        gap-4
        px-5
        py-4
        rounded-2xl
        transition-all
        font-medium
        ${isActive
          ? `
              bg-blue-600
              text-white
              shadow-lg
              shadow-blue-500/40
            `
          : `
              text-slate-300
              hover:bg-white/10
            `
        }
      `
      }
    >

      {icon}

      <span>{title}</span>

    </NavLink>
  );
}

export default AdminLayout;