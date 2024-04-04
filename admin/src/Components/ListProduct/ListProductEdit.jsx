import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ListProductEdit.css"; // Import your CSS file for styling

const ListProductEdit = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const navigate = useNavigate();
  const [image, setImage] = useState("");

  useEffect(() => {
    const getProductData = async (productId) => {
      try {
        const response = await fetch(
          `http://localhost:4000/product/${productId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch product data");
        }
        const productData = await response.json();
        setProduct(productData);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    getProductData(id);
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formData = new FormData();
    formData.append("product", image);

    try {
      console.log(formData.get("product"));
      const res = await fetch("http://localhost:4000/upload", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      const responseData = await res.json();
      console.log(responseData.image_url);

      if (responseData.success) {
        const response = await fetch(
          `http://localhost:4000/product/${id}/edit`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: product.name,
              image: responseData.image_url,
              old_price: product.old_price,
              new_price: product.new_price,
            }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to update product");
        }
        // Handle successful submission (e.g., show success message, redirect)
        navigate("/listproduct");
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div className="container">
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="productName">Product Name:</label>
          <input
            type="text"
            id="productName"
            name="name"
            value={product.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="oldPrice">Old Price:</label>
          <input
            type="number"
            id="oldPrice"
            name="old_price"
            value={product.old_price}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPrice">New Price:</label>
          <input
            type="number"
            id="newPrice"
            name="new_price"
            value={product.new_price}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Image:</label>
          {product.image && (
            <img src={product.image} alt="Product" className="preview-image" />
          )}
          <input
            type="file"
            id="image"
            name="image"
            onChange={(e) => {
              setImage(e.target.files[0]);
              setProduct({
                ...product,
                image: URL.createObjectURL(e.target.files[0]),
              });
            }}
          />
        </div>
        <button type="submit" className="btn-submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ListProductEdit;
