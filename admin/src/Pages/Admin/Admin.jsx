import React from "react";
import "./Admin.css";
import Sidebar from "../../Components/Sidebar/Sidebar";
import { Routes, Route } from "react-router-dom";
import AddProduct from "../../Components/AddProduct/AddProduct";
import ListProduct from "../../Components/ListProduct/ListProduct";
import ListProductEdit from "../../Components/ListProduct/ListProductEdit";
import Orders from "../../Components/Orders/Orders";

const Admin = () => {
  return (
    <div className="admin">
      <Sidebar />
      <Routes>
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/listproduct" element={<ListProduct />} />
        <Route path="/listproduct/:id/edit" element={<ListProductEdit />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </div>
  );
};

export default Admin;
