const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");

const systemConfig= require("../../config/system");
const filterStatusHelper = require("../../helper/filterStatus");
const searchHelper = require("../../helper/search");
const paginationHelper = require("../../helper/pagination");

// GET /admin/products
module.exports.index = async (req, res) => {
    
    const filterStatus= filterStatusHelper(req.query);

    let find = {
        deleted: false
    };

    if(req.query.status) {
        find.status = req.query.status;
    }
    
    const objectSearch = searchHelper(req.query);
    if(objectSearch.regex){
        find.title= objectSearch.regex;
    }

    // Pagination
    const countProducts = await Product.countDocuments(find);
    let objectPagination = paginationHelper(
        {
        currentPage:1,
        limitItems: 4
        },
        req.query,
        countProducts
    );

    // End Pagination
    // Sort
    let sort= {};
    if(req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey]= req.query.sortValue;
    }else{
        sort.position= "desc";
    }
    
    // End Sort

    const products = await Product.find(find).sort(sort).limit(objectPagination.limitItems).skip(objectPagination.skip);

    res.render("admin/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}

// GET /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req,res) => {
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({_id:id}, {status:status});

    req.flash("success", "Cập nhật trạng thái sản phẩm thành công!");
    res.redirect("back");
}

module.exports.changeMulti = async (req,res) => {
    const type= req.body.type;
    const ids= req.body.ids.split(", ");

    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } }, { status: "active"});
            req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`);
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } }, { status: "inactive"});
            req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`);
            break;
        case "delete-all":
            await Product.updateMany({ _id: { $in: ids } }, { deleted: true, deleteAt: new Date()});
            req.flash("success", `Xóa thành công ${ids.length} sản phẩm`);
            break;
        case "change-position":
            for (const item of ids){
                let [id, position] = item.split("-");
                position= parseInt(position);
                await Product.updateOne({_id:id}, {position:position});
            }
            req.flash("success", `Thay đổi vị trí thành công ${ids.length} sản phẩm!`);
            // await Product.updateMany({ _id: { $in: ids } }, { deleted: true, deleteAt: new Date()});
            break;
        default:
            break;
    }
    res.redirect("back");
}

// DELETE /admin/products/delete/:id
module.exports.deleteItem = async (req,res) => {
    const id = req.params.id;

    // await Product.deleteOne({ _id: id});
    await Product.updateOne({ _id: id}, { deleted: true, deleteAt: new Date()});
    req.flash("success", "Xóa thành công sản phẩm!");
    res.redirect("back");
};

module.exports.create = async (req, res) => {

    let find = {
        deleted: false
    };

    function createTree(arr, parentId = "") {
        const tree = [];
        arr.forEach((item) => {
            if (item.parent_id === parentId) {
                const newItem = item;
                const children = createTree(arr, item.id);
                if (children.length > 0) {
                    newItem.children = children;
                }
                tree.push(newItem);
            }
        });
        return tree;
    }

    const category = await ProductCategory.find(find);

    const newCategory = createTree(category);

    res.render("admin/pages/products/create", {
        pageTitle: "Thêm mới sản phẩm",
        category: newCategory
    });
}

module.exports.createPost = async (req, res) => {
    
    req.body.price= parseInt(req.body.price);
    req.body.discountPercentage= parseInt(req.body.discountPercentage);
    req.body.stock= parseInt(req.body.stock);
    
    if(req.body.position == ""){
        const countProducts = await Product.countDocuments();
        req.body.position= countProducts+1;
    }else{
        req.body.position= parseInt(req.body.position);
    }

    const product= new Product(req.body);
    await product.save();
    req.flash("success", "Tạo mới sản phẩm thành công")
    res.redirect(`${systemConfig.prefixAdmin}/products`);

}

module.exports.edit = async (req, res) => {
    
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };
        let find2 = {
            deleted: false
        };
    
        function createTree(arr, parentId = "") {
            const tree = [];
            arr.forEach((item) => {
                if (item.parent_id === parentId) {
                    const newItem = item;
                    const children = createTree(arr, item.id);
                    if (children.length > 0) {
                        newItem.children = children;
                    }
                    tree.push(newItem);
                }
            });
            return tree;
        }
    
        const category = await ProductCategory.find(find2);
    
        const newCategory = createTree(category);
        const product = await Product.findOne(find);
        
        res.render("admin/pages/products/edit", {
            pageTitle: "Chỉnh sửa sản phẩm",
            product: product,
            category: newCategory
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }
}


module.exports.editPatch = async (req, res) => {
    const id=req.params.id;
    req.body.price= parseInt(req.body.price);
    req.body.discountPercentage= parseInt(req.body.discountPercentage);
    req.body.stock= parseInt(req.body.stock);
    req.body.position= parseInt(req.body.position);
    
    // if(req.file){
    //     req.body.thumbnail = `/uploads/${req.file.filename}`;
    // }

    try {
        await Product.updateOne({ _id: id }, req.body);
        req.flash("success", `Cập nhật sản phẩm thành công!`);
    } catch (error) {
        req.flash("error", `Cập nhật sản phẩm thất bại!`);
    }

    res.redirect("back");
}


module.exports.detail = async (req, res) => {
    
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };
    
        const product = await Product.findOne(find);
        
        res.render("admin/pages/products/detail", {
            pageTitle: product.title,
            product: product
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }
}