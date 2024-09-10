const mongoose = require('mongoose');
const Product = require("./models/product");


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

// const p = new Product({
//     name: "Ruby Grapefruit",
//     price: 1.99,
//     category: "fruit"
// });
// p.save()
//     .then(res => {
//         console.log(res);
//     })
//     .catch(err => {
//         console.log(err)
//     })

const seedProducts = [
    {
        name: "Fairy Eggplant",
        price: 1.00,
        category: "vegetable"
    },
    {
        name: "Organic Goddess Melon",
        price: 4.99,
        category: "fruit"
    },
    {
        name: "Organic Mini Seedless Watermelon",
        price: 3.99,
        category: "fruit"
    },
    {
        name: "Organic Celery",
        price: 1.50,
        category: "vegetable"
    },
    {
        name: "Chocolate whole milk",
        price: 2.69,
        category: "dairy"
    }
];

Product.insertMany(seedProducts)
    .then(res => {
        console.log(res);
    })
    .catch(err => {
        console.log(err);
    })