const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { subscribe } = require("diagnostics_channel");

app.use(express.json());
app.use(cors());

//Database connection with mongodb

mongoose.connect(
  "mongodb+srv://sahilingale15:Sahil%4006@mycart.afr0dwr.mongodb.net/"
);

//API Creation

app.get("/", (req, res) => {
  res.json("Express App is Running");
});

// Image Storage Engine
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

// Creating upload endpoint for images
app.use("/images", express.static("upload/images"));

app.post("/upload", upload.single("product"), (req, res) => {
  console.log(req.file.filename);
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

//checkout api
app.post("/api/create-checkout-session", async (req, res) => {
  const product = req.body;
  console.log(product);
});

//Schema for Creating Products
const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

app.post("/addproduct", async (req, res) => {
  try {
    const products = await Product.find({});

    let id;
    if (products.length > 0) {
      let last_product_array = products.slice(-1);
      let last_product = last_product_array[0];
      id = last_product.id + 1;
    } else {
      id = 1;
    }

    const product = new Product({
      id: id,
      name: req.body.name,
      image: req.body.image,
      category: req.body.category,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
    });

    console.log(product);
    await product.save();

    console.log("saved");

    res.json({
      success: true,
      name: req.body.name,
    });
  } catch (error) {
    return res.json({
      success: false,
      error: "Sorry, something went wrong form server",
    });
  }
});

//Creating API for delete Product

app.post("/removeproduct", async (req, res) => {
  try {
    await Product.findOneAndDelete({ id: req.body.id });
    console.log("removed");
    res.json({
      success: true,
      name: req.body.name,
    });
  } catch (error) {
    res.json({ success: false, error: "Something went wrong from server" });
  }
});

//Creating API for clearing the cart

//Creating Api for getting all products

app.get("/allproducts", async (req, res) => {
  try {
    let products = await Product.find({});
    console.log("All Products Fetched");

    return res.json(products);
  } catch (err) {
    res.json({ success: false, error: "Something went wrong from server" });
  }
});

app.get("/product/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    console.log(productId);
    const product = await Product.findById(productId);
    res.json(product);
  } catch (err) {
    res.json({ success: false, error: "Something went wrong from server" });
  }
});

app.put("/product/:id/edit", async (req, res) => {
  try {
    const productId = req.params.id;
    const data = req.body;
    const product = await Product.findByIdAndUpdate(productId, data);
    return res.json(product);
  } catch (err) {
    res.json({ success: false, error: "Something went wrong from server" });
  }
});

//Schema creating for User model
const Users = mongoose.model("Users", {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

app.post("/clearcart", async (req, res) => {
  try {
    const users = await Users.find({ cartData: { $type: "object" } });
    let result;

    // Update cartData for each document
    for (const user of users) {
      const updatedCartData = {};
      for (const key in user.cartData) {
        updatedCartData[key] = 0;
      }
      user.cartData = updatedCartData;
      result = await user.save();
    }
    console.log(result);

    return res.json(result);
  } catch (err) {
    res.json({ success: false, error: "Something went wrong from server" });
  }
});

//Creating Endpoint for registering the user
app.post("/signup", async (req, res) => {
  try {
    let check = await Users.findOne({ email: req.body.email });
    if (check) {
      return res.status(400).json({
        success: false,
        error: "existing user found with same email address",
      });
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
      cart[i] = 0;
    }
    const user = new Users({
      name: req.body.username,
      email: req.body.email,
      password: req.body.password,
      cartData: cart,
    });
    await user.save();

    const data = {
      user: {
        id: user.id,
      },
    };
    const token = jwt.sign(data, "secret_ecom");
    res.json({ success: true, token, id: user.id });
  } catch (error) {
    return res.json({
      success: false,
      error: "Something went wrong from server",
    });
  }
});

//creating endpoint for userlogin
app.post("/login", async (req, res) => {
  let user;
  try {
    user = await Users.findOne({ email: req.body.email });
  } catch (err) {
    return res.json({ success: false, error: "Something went wrong" });
  }

  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, "secret_ecom");
      res.json({
        success: true,
        token,
        id: user.id,
      });
    } else {
      return res.json({ success: false, error: "Wrong Password" });
    }
  } else {
    return res.json({ success: false, error: "user not found" });
  }
});

//creating endpoint for newcollection data
app.get("/newcollections", async (req, res) => {
  try {
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    //we will get recently added 8 products and we will get new collection products
    console.log("New Collection Fetched");
    res.json(newcollection);
  } catch (err) {
    res.json({ success: false, error: "Something went wrong from server" });
  }
});

//creating endpoint for popular in women section
app.get("/popularinwomen", async (req, res) => {
  try {
    let products = await Product.find({
      category: "women",
    });
    let popular_in_women = products.slice(0, 4);
    console.log("Popular in women fetched");
    res.json(popular_in_women);
  } catch (err) {
    res.json({ success: false, error: "Something went wrong from server" });
  }
});

//Creating middleware to fetch user
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).json({ errors: "Please authenticate using valid token" });
  } else {
    try {
      const data = jwt.verify(token, "secret_ecom");
      req.user = data.user;
      next();
      //by this we will get the access to user's data
    } catch (error) {
      res
        .status(401)
        .json({ errors: "Please autheticate using a valid token ." });
    }
  }
};

//Creating endpoint for adding product in cart Data

app.post("/addtocart", fetchUser, async (req, res) => {
  try {
    console.log("Added", req.body.itemId);
    let userData = await Users.findOne({ _id: req.user.id });
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate(
      { _id: req.user.id },
      { cartData: userData.cartData }
    );
    res.json("Added");
  } catch (err) {
    res.json({ success: false, error: "Something went wrong from server" });
  }
});

//Creating endpoint to remove product from cart data
app.post("/removefromcart", fetchUser, async (req, res) => {
  try {
    console.log("removed", req.body.itemId);
    let userData = await Users.findOne({ _id: req.user.id });
    if (userData.cartData[req.body.itemId] > 0)
      userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate(
      { _id: req.user.id },
      { cartData: userData.cartData }
    );
    res.json("Removed");
  } catch (err) {
    res.json({ success: false, error: "Something went wrong from server" });
  }
});

//creating endpoint to get cart data

app.post("/getcart", fetchUser, async (req, res) => {
  try {
    console.log("GetCart");
    let userData = await Users.findOne({ _id: req.user.id });
    res.json(userData.cartData);
  } catch (err) {
    res.json({ success: false, error: "Something went wrong from server" });
  }
});

const orderSchema = new mongoose.Schema({
  users: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users", // Reference to Customer model
    required: true,
  },
  products: [
    {
      productId: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
});

const Order = mongoose.model("Orders", orderSchema);

app.post("/create-order", fetchUser, async (req, res) => {
  try {
    console.log("create order");
    const orderDetails = req.body;
    let order = new Order(orderDetails);
    order = await order.save();
    console.log(order);
    return res.json({ order });
  } catch (err) {
    res.json({ success: false, error: "Something went wrong from server" });
  }
});

app.get("/orders", async (req, res) => {
  try {
    const data = await Order.find().populate("users");
    return res.json(data);
  } catch (err) {
    res.json({ success: false, error: "Something went wrong from server" });
  }
});

app.listen(port, (error) => {
  if (!error) {
    console.log("Server Runngin on port " + port);
  } else {
    console.log("error" + error);
  }
});
