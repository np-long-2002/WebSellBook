function LatestOrders({
  orders
}) {

  return (

    <div
      className="
      bg-white
      rounded-2xl
      shadow-sm
      border
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
        Latest Orders
      </h2>

      <table
        className="
        w-full
        "
      >

        <thead>

          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Total</th>
            <th>Status</th>
          </tr>

        </thead>

        <tbody>

          {orders.map(o => (

            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.user}</td>
              <td>
                {o.total.toLocaleString()}
              </td>
              <td>{o.status}</td>
            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );
}

export default LatestOrders;