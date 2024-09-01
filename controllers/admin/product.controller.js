const Product = require('../../models/product.model');
const filterStatusHelper = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search');
const paginationHelper = require('../../helpers/pagination');
const systemConfig = require('../../config/system');

// [GET] /admin/dashboard
module.exports.index = async (req, res) => {
    let find = { 
        deleted: false
    }

    //Filter Feature
    const filterStatus = filterStatusHelper(req, find);
    /*console.log(filterStatus)*/
    
    // End Filter Feature

    // Search Feature
    const keyword = searchHelper(req, find);
    // End Search Feature

    //Pagination
    const countProducts = await Product.countDocuments(find);
    let objectPagination = paginationHelper(req, {
        limitItems: 4,
        currentPage: 1
    }, countProducts);
    //End Pagination

    const products = await Product.find(find)
        .sort({position: "asc"})
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);
    //console.log(products)
    
    res.render('admin/pages/products/index', {
        pageTitle: "Trang danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: keyword,
        pagination: objectPagination
    })
}

// [PATCH] /admin/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({_id: id}, {status: status});
    req.flash('success', 'Cập nhật trạng thái thành công');
    res.redirect("back");
}

// [PATCH] /admin/change-multi
module.exports.changeMulti = async (req, res) => {
    const { type, ids } = req.body;
    const idArray = ids.split(", ");

    switch (type) {
        case "active":
            await Product.updateMany({_id: {$in: idArray}}, {status: "active"});
            req.flash('success', `Đã cập nhật thành công ${idArray.length} sản phẩm`);
            break;
        case "inactive":
            await Product.updateMany({_id: {$in: idArray}}, {status: "inactive"});
            req.flash('success', `Đã cập nhật thành công ${idArray.length} sản phẩm`);
            break;
        case "delete-all":
            await Product.updateMany({_id: {$in: idArray}}, {
                deleted: true,
                deletedAt: new Date()
            });
            break;
        case "change-position":
            for (const item of idArray) {
                let [id, position] = item.split("-")
                position = parseInt(position)
                await Product.updateOne({_id: id}, {position: position})
            }
            break;
        default:
            break;
    }

    res.redirect("back");
};

//[DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    //await Product.deleteOne({_id: id})
    await Product.updateOne(
        {_id: id}, {
            deleted: true,
            deletedAt: new Date()
        },
    )
    res.redirect("back");
}

// [GET] /admin/products/create
module.exports.create = (req, res) => {
    res.render('admin/pages/products/create', {
        pageTitle: "Tạo mới sản phẩm"
    })
}

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    //console.log(req.file)
    
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if(req.body.position == '') {
        const countProducts = await Product.countDocuments({});
        req.body.position = countProducts + 1;
    }
    else {
        req.body.position = parseInt(req.body.position);
    }
    
    // if(req.file)
    //     req.body.thumbnail = `/uploads/${req.file.filename}`;
    // else
    //     req.body.thumbnail = '';
    const product = new Product(req.body);
    await product.save();
    
    res.redirect(`${systemConfig.prefixAdmin}/products`);
}

//[GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false, 
            _id: req.params.id
        }
        const product = await Product.findOne(find)
        res.render('admin/pages/products/edit', {
            pageTitle: "Chỉnh sửa sản phẩm",
            product: product
        })
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }
}

//[PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    //console.log(req.body);
    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)
    req.body.position = parseInt(req.body.position)
    
    if(req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`
    }
    else {
        req.body.thumbnail = '';
    }

    try {
        await Product.updateOne({_id: req.params.id}, req.body);
        req.flash('success', 'Cập nhật thông tin sản phẩm thành công');
    } catch (error) {
        req.flash('error', 'Lỗi cập nhật sản phẩm!!!')
    }
    
    res.redirect(`back`)
}

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }
        const product = await Product.findOne(find)
        res.render('admin/pages/products/detail', {
            pageTitle: product.title, 
            product: product
        })
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
}
