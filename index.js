const express = require("express");
const app = express();
const port = 3000;
const ejs = require('ejs');
const path = require("path");
const mongoose = require('mongoose');
const Product = require("./models/product");
const methodOverride = require('method-override')
const CustomError = require("../CustomError");
const Farm = require("./models/farm")


async function main() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/farmStand2');
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

const wrapAsync = (fn) => {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e))
    }
}


//FARMS
app.get("/farms", async (req, res) => {
    const farms = await Farm.find({})
    res.render("farms/index", { farms });
})

app.get("/farms/new", (req, res) => {
    res.render("farms/new");
})

app.get("/farms/:id", async (req, res) => {
    const farm = await Farm.findById(req.params.id).populate("products");
    console.log(farm);
    res.render("farms/show", { farm })
})

app.delete("/farms/:id", async (req, res) => {
    const farm = await Farm.findByIdAndDelete(req.params.id);
    console.log("deleted");
    res.redirect("/farms");
})

app.post("/farms", async (req, res) => {
    const farm = new Farm(req.body);
    await farm.save();
    res.redirect("/farms")
})

app.get("/farms/:id/products/new", async (req, res) => {
    const id = req.params.id;
    const farm = await Farm.findById(id);
    res.render("Products/new", { categoryArr, farm })
})

app.post("/farms/:id/products", async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    const { name, price, category } = req.body
    const product = new Product({ name, price, category });
    farm.products.push(product);
    product.farm = farm;
    await product.save();
    await farm.save();
    res.redirect(`/farms/${id}`);
})

//PRODUCTS
const categoryArr = ["fruit", "vegetable", "dairy"];

app.get("/products", wrapAsync(async (req, res, next) => {
    const { category } = req.query;
    if (category) {
        const products = await Product.find({ category });
        res.render("Products/index", { products, category })
    } else {
        const products = await Product.find({});
        res.render("Products/index", { products, category: "All" })
    }

}))

app.get("/products/new", (req, res) => {
    // throw new CustomError(401, "You are not allowed here")
    res.render("Products/new", { categoryArr });
})

app.get("/products/:id", wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate("farm", "name");
    if (!product) {
        throw new CustomError(404, "Product not found")
    }
    console.log(product)
    res.render("Products/show", { product });
}))


app.get("/products/:id/edit", wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        throw new CustomError(404, "Product not found")
    }
    res.render("Products/edit", { product, categoryArr })
}))

app.post("/products", wrapAsync(async (req, res, next) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    console.log(newProduct);
    res.redirect(`/products/${newProduct._id}`);
}))

app.put("/products/:id", wrapAsync(async (req, res, next) => {
    // console.log(req.body);
    const { id } = req.params;
    console.log(id)
    console.log(req.body);
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    console.log(product);
    res.redirect(`/products/${product._id}`)
}))

app.delete("/products/:id", async (req, res) => {
    const { id } = req.params;
    const deleteProduct = await Product.findByIdAndDelete(id);
    res.redirect("/products");
})


app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;
    res.status(status).send(message);
})

app.listen(port, () => {
    console.log(`listening at port:${port}`);
})