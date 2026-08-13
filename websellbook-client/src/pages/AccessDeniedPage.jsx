function AccessDeniedPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500">
          403
        </h1>

        <p className="text-2xl mt-4">
          Access Denied
        </p>

        <p className="text-gray-500 mt-2">
          Bạn không có quyền truy cập trang này.
        </p>
      </div>
    </div>
  );
}

export default AccessDeniedPage;