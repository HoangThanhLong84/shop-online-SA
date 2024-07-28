const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const paginationHelper = require("../../helper/pagination");
const filterStatusHelper = require("../../helper/filterStatus");
const searchHelper = require("../../helper/search");

module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };
    const filterStatus= filterStatusHelper(req.query);
    const countProducts = await ProductCategory.countDocuments(find);
    let objectPagination = paginationHelper(
        {
        currentPage:1,
        limitItems: 4
        },
        req.query,
        countProducts
    );
    let count = 0;
    function createTree(arr, parentId = "") {
        const tree = [];
        arr.forEach((item) => {
            if (item.parent_id === parentId) {
                count++;
                const newItem = item;
                newItem.index = count;
                const children = createTree(arr, item.id);
                if (children.length > 0) {
                    newItem.children = children;
                }
                tree.push(newItem);
            }
        });
        return tree;
    }

    if(req.query.status) {
        find.status = req.query.status;
    }
    
    const objectSearch = searchHelper(req.query);
    if(objectSearch.regex){
        find.title= objectSearch.regex;
    }

    const records = await ProductCategory.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip);

    const newRecords = createTree(records);
    res.render("admin/pages/product-category/index", {
        pageTitle: "Danh mục sản phẩm",
        records: newRecords,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword, 
        pagination: objectPagination
    });
};

// GET /admin/product-category/change-status/:status/:id
module.exports.changeStatus = async (req,res) => {
    const status = req.params.status;
    const id = req.params.id;

    await ProductCategory.updateOne({_id:id}, {status:status});

    req.flash("success", "Cập nhật trạng thái danh mục thành công!");
    res.redirect("back");
}

module.exports.changeMulti = async (req,res) => {
    const type= req.body.type;
    const ids= req.body.ids.split(", ");

    switch (type) {
        case "active":
            await ProductCategory.updateMany({ _id: { $in: ids } }, { status: "active"});
            req.flash("success", `Cập nhật trạng thái thành công ${ids.length} danh mục!`);
            break;
        case "inactive":
            await ProductCategory.updateMany({ _id: { $in: ids } }, { status: "inactive"});
            req.flash("success", `Cập nhật trạng thái thành công ${ids.length} danh mục!`);
            break;
        case "delete-all":
            await ProductCategory.updateMany({ _id: { $in: ids } }, { deleted: true, deleteAt: new Date()});
            req.flash("success", `Xóa thành công ${ids.length} danh mục`);
            break;
        case "change-position":
            for (const item of ids){
                let [id, position] = item.split("-");
                position= parseInt(position);
                await ProductCategory.updateOne({_id:id}, {position:position});
            }
            req.flash("success", `Thay đổi vị trí thành công ${ids.length} danh mục!`);
            // await Product.updateMany({ _id: { $in: ids } }, { deleted: true, deleteAt: new Date()});
            break;
        default:
            break;
    }
    res.redirect("back");
}

// DELETE /admin/product-category/delete/:id
module.exports.deleteItem = async (req,res) => {
    const id = req.params.id;

    // await Product.deleteOne({ _id: id});
    await ProductCategory.updateOne({ _id: id}, { deleted: true, deleteAt: new Date()});
    req.flash("success", "Xóa thành công danh mục!");
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

    const records = await ProductCategory.find(find);

    const newRecords = createTree(records);

    res.render("admin/pages/product-category/create", {
        pageTitle: "Tạo danh mục sản phẩm",
        records: newRecords
    });
};

module.exports.createPost = async (req, res) => {
    if (req.body.position == "") {
        const count = await ProductCategory.countDocuments();
        req.body.position = count + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    const record = new ProductCategory(req.body);
    await record.save();
    req.flash("success", "Tạo mới danh mục thành công")
    res.redirect(`${systemConfig.prefixAdmin}/product-category`);
};


module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;

        const data = await ProductCategory.findOne({
            _id: id,
            deleted: false
        });

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

        const records = await ProductCategory.find({
            deleted: false
        });

        const newRecords = createTree(records);

        res.render("admin/pages/product-category/edit", {
            pageTitle: "Chỉnh sửa danh mục sản phẩm",
            data: data,
            records: newRecords
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/product-category`)
    }


};

module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    req.body.position = parseInt(req.body.position);
    try {
        await ProductCategory.updateOne({ _id: id }, req.body);
        req.flash("success", "Cập nhật thành công!")
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/product-category`)
    }

    res.redirect("back");
};