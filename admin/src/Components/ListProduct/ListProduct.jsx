import React, { useEffect, useState } from "react";
import "./ListProduct.css";
import cross_icon from "../../assets/cross_icon.png";
import edit_icon from "../../assets/edit_icon.png";
import {Link} from 'react-router-dom';

const ListProduct = () => {
  const [allproducts, setAllProducts] = useState([]);

  const fetchInfo = async () => {
    try {
      const response = await fetch("http://localhost:4000/allproducts");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setAllProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };


  useEffect(() => {
    fetchInfo();
  }, []);

  const removeProduct = async (id) => {
    try {
      const response = await fetch("http://localhost:4000/removeproduct", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });
      if (!response.ok) {
        throw new Error("Failed to remove product");
      }
      await fetchInfo();
    } catch (error) {
      console.error("Error removing product:", error);
    }
  };

  const editProduct = (id) => {
    // Implement edit functionality here
    console.log("Editing product with ID:", id);
  };

  return (
    <div className="list-product">
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Actions</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((product, index) => (
          <div
            key={index}
            className="listproduct-format-main listproduct-format"
          >
            <img
              src={product.image}
              alt=""
              className="listproduct-product-icon"
            />
            <p>{product.name}</p>
            <p>${product.old_price}</p>
            <p>${product.new_price}</p>
            <p>{product.category}</p>
            <div>
              <img
                onClick={() => removeProduct(product.id)}
                className="listproduct-action-icon"
                src={cross_icon}
                alt="Remove"
              />
              <Link to={`/listproduct/${product._id}/edit`}>
                <img
                  onClick={() => editProduct(product._id)}
                  className="listproduct-action-icon"
                  src={edit_icon}
                  alt="Edit"
                />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListProduct;
