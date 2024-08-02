const express = require("express");
const app = express();
const port = 3000;
const ejs = require('ejs');
const path = require("path");
const mongoose = require('mongoose');
const Product = require("./models/product");
const methodOverride = require('method-override')

const categoryArr = ["fruit", "vegetable", "dairy"];

async function main() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/farmStand');
        console.log("connect");

    }
    catch (err) {
        console.log(err);
    }
}

main();

app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));

app.get("/products", async (req, res) => {
    const { category } = req.query;
    if (category) {
        const products = await Product.find({ category });
        res.render("Products/index", { products, category })
    } else {
        const products = await Product.find({});
        res.render("Products/index", { products, category: "All" })
    }
})

app.get("/products/new", (req, res) => {
    res.render("Products/new", { categoryArr });
})

app.get("/products/:id", async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    console.log(product);
    res.render("Products/show", { product });
})


app.get("/products/:id/edit", async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render("Products/edit", { product, categoryArr })
})

app.post("/products", async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    console.log(newProduct);
    res.redirect(`/products/${newProduct._id}`);
})

app.put("/products/:id", async (req, res) => {
    // console.log(req.body);
    const { id } = req.params;
    console.log(id)
    console.log(req.body);
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    console.log(product);
    res.redirect(`/products/${product._id}`)
})

app.delete("/products/:id", async (req, res) => {
    const { id } = req.params;
    const deleteProduct = await Product.findByIdAndDelete(id);
    res.redirect("/products");
})

app.listen(port, () => {
    console.log(`listening at port:${port}`);
})