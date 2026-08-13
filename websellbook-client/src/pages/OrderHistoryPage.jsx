import { useEffect, useState } from "react";
import { getMyOrders, cancelOrder } from "../services/orderService";

function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getMyOrders();
        setOrders(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleCancel = async (orderId) => {
    try {
      const confirmCancel = window.confirm(
        "Bạn có chắc muốn hủy đơn hàng này?"
      );

      if (!confirmCancel) return;

      await cancelOrder(orderId);

      const data = await getMyOrders();
      setOrders(data);

      alert("Hủy đơn thành công");
    } catch (error) {
      console.log(error);
      alert(
        error?.response?.data?.message || "Không thể hủy đơn"
      );
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      Pending: {
        bg: "from-yellow-400 to-orange-400",
        badge: "bg-yellow-100 text-yellow-800",
        icon: "⏳",
      },
      Confirmed: {
        bg: "from-blue-400 to-cyan-400",
        badge: "bg-blue-100 text-blue-800",
        icon: "✓",
      },
      Shipping: {
        bg: "from-purple-400 to-pink-400",
        badge: "bg-purple-100 text-purple-800",
        icon: "🚚",
      },
      Completed: {
        bg: "from-green-400 to-emerald-400",
        badge: "bg-green-100 text-green-800",
        icon: "✅",
      },
      Cancelled: {
        bg: "from-red-400 to-pink-400",
        badge: "bg-red-100 text-red-800",
        icon: "✗",
      },
    };
    return configs[status] || configs.Pending;
  };

  const OrderSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-4 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-32 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded-full w-24"></div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">📦</span>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Đơn Hàng Của Tôi
            </h1>
          </div>
          <p className="text-gray-600 text-lg ml-12">
            {orders.length === 0
              ? "Chưa có đơn hàng"
              : `${orders.length} đơn hàng`}
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <OrderSkeleton key={i} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-100">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Chưa có đơn hàng nào
            </h2>
            <p className="text-gray-500 text-lg">
              Hãy khám phá thư viện sách của chúng tôi
            </p>
            <a
              href="/"
              className="mt-6 inline-block px-8 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Mua sách ngay
            </a>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  {/* Header */}
                  <div className={`bg-gradient-to-r ${statusConfig.bg} p-4 text-white`}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{statusConfig.icon}</span>
                        <div>
                          <h3 className="text-2xl font-bold">
                            Đơn #{order.id}
                          </h3>
                          <p className="text-white/80 text-sm mt-1">
                            {new Date(order.createdAt).toLocaleString(
                              "vi-VN"
                            )}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`${statusConfig.badge} px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    {/* Items */}
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-800 mb-4 text-lg">
                        📚 Chi tiết đơn hàng:
                      </h4>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {order.items?.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-100 hover:border-indigo-300 transition-colors"
                          >
                            <div className="flex-1">
                              <p className="font-semibold text-gray-800">
                                {item.bookTitle}
                              </p>
                              <p className="text-sm text-gray-500">
                                {item.bookAuthor && `Tác giả: ${item.bookAuthor}`}
                              </p>
                            </div>
                            <div className="text-right ml-4">
                              <p className="font-bold text-indigo-600 text-lg">
                                x{item.quantity}
                              </p>
                              {item.price && (
                                <p className="text-sm text-gray-500">
                                  {(item.price * item.quantity).toLocaleString()}₫
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-200 pt-6 flex justify-between items-center">
                      <div>
                        <p className="text-gray-600 text-sm mb-1">
                          Tổng tiền:
                        </p>
                        <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                          {order.totalAmount?.toLocaleString()}₫
                        </p>
                      </div>

                      {order.status === "Pending" && (
                        <button
                          onClick={() => handleCancel(order.id)}
                          className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
                        >
                          <span>🗑️</span>
                          Hủy đơn
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderHistoryPage;