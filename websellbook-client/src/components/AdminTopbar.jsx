import { FaBell } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getDashboard } from "../services/dashboardService";
import { getUserInfo } from "../utils/jwtUtils";

function AdminTopbar() {

  const user = getUserInfo();

  const navigate = useNavigate();

  const [pendingOrders,setPendingOrders]=useState(0);

  useEffect(()=>{

    loadNotification();

    const interval=setInterval(loadNotification,30000);

    return ()=>clearInterval(interval);

  },[]);

  const loadNotification=async()=>{

    try{

      const data=await getDashboard();

      setPendingOrders(data.pendingOrders ?? 0);

    }

    catch(err){

      console.log(err);

    }

  };

  return (

    <header
      className="
      h-20
      bg-white
      shadow-sm
      flex
      items-center
      justify-between
      px-8
      "
    >

      <h2 className="text-2xl font-bold">

        Dashboard

      </h2>

      <div className="flex items-center gap-6">

        <button

          onClick={()=>navigate("/admin/orders")}

          className="
          relative
          p-2
          rounded-full
          hover:bg-gray-100
          transition
          "

        >

          <FaBell size={20}/>

          {

            pendingOrders>0 &&

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
              font-bold
              min-w-[22px]
              h-[22px]
              flex
              items-center
              justify-center
              "
              >

                {pendingOrders}

              </span>

              <span
              className="
              absolute
              top-0
              right-0
              w-3
              h-3
              bg-red-500
              rounded-full
              animate-ping
              "
              />

            </>

          }

        </button>

        <div className="flex items-center gap-3">

          <div
            className="
            w-10
            h-10
            rounded-full
            bg-blue-600
            text-white
            flex
            items-center
            justify-center
            font-bold
            "
          >

            {user?.fullName?.charAt(0)}

          </div>

          <div>

            <p className="font-semibold">

              {user?.fullName}

            </p>

            <p className="text-xs text-slate-500">

              {user?.role}

            </p>

          </div>

        </div>

      </div>

    </header>

  );

}

export default AdminTopbar;