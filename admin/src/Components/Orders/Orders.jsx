import React, { useState, useEffect } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]); // State to hold orders data

  useEffect(() => {
    // Function to fetch orders data from the server
    const fetchOrders = async () => {
      try {
        // Make a GET request to fetch orders data from the server
        const response = await fetch("http://localhost:4000/orders"); // Assuming your API endpoint for fetching orders is '/orders'
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json(); // Extract JSON data from the response
        console.log(data);
        setOrders(data); // Update orders state with the fetched data
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    // Call the fetchOrders function when the component mounts
    fetchOrders();
  }, []); // Empty dependency array ensures that this effect runs only once, equivalent to componentDidMount

  return (
    <div>
      <h2>Orders</h2>
      <table>
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Product ID(s)</th>
            <th>Product Quantity</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {/* Map through orders array and render each order as a table row */}
          {orders.map((order, index) => (
            <tr key={index}>
              {/* Display order details */}
              <td>{order.users.name}</td>
              <td>
                {/* Render each product ID separately below each other */}
                {order.products.map((product) => (
                  <div key={product.productId}>{product.productId}</div>
                ))}
              </td>
              <td>
                {/* Render each product quantity separately below each other */}
                {order.products.map((product) => (
                  <div key={product.productId}>{product.quantity}</div>
                ))}
              </td>
              <td>{order.totalAmount}</td>
              {/* You can render other order details as needed */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
