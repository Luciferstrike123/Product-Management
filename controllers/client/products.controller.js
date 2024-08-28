const Product = require('../../models/product.model')

module.exports.index = async function (req, res) {
    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({position: "asc"})
    const newProducts = products.map(item => {
        item.priceNew = (item.price*(100 - item.discountPercentage)/100).toFixed(2)
        return item
    })
    //console.log(newProducts)

    res.render('client/pages/products/index', {
        pageTitle: "Danh sách sản phẩm",
        products: newProducts
    })
}

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            slug: req.params.slug,
            status: "active"
        }
        const product = await Product.findOne(find)
    
        res.render("client/pages/products/detail", {
            pageTitle: "Chi tiết sản phẩm",
            product: product
        })
    } catch (error) {
        res.redirect("/products")
    }

    
}