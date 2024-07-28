const Role = require("../../models/role.model");
const paginationHelper = require("../../helper/pagination");
const systemConfig = require("../../config/system");

// GET /admin/roles
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };


    // Pagination
    const countRoles = await Role.countDocuments(find);
    let objectPagination = paginationHelper(
        {
        currentPage:1,
        limitItems: 4
        },
        req.query,
        countRoles
    );

    // End Pagination
    const records = await Role.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip);

    res.render("admin/pages/roles/index", {
        pageTitle: "Nhóm quyền",
        records: records,
        pagination: objectPagination
    });
} 

module.exports.deleteItem = async (req,res) => {
    const id = req.params.id;

    // await Product.deleteOne({ _id: id});
    await Role.updateOne({ _id: id}, { deleted: true, deleteAt: new Date()});
    req.flash("success", "Xóa thành công role!");
    res.redirect("back");
};

module.exports.create = async (req, res) => {
    
    res.render("admin/pages/roles/create", {
        pageTitle: "Tạo nhóm quyền"
    });
}

module.exports.createPost = async (req, res) => {
   
    const record = new Role(req.body);
    await record.save();
    req.flash("success", "Tạo mới nhóm quyền thành công")
    res.redirect(`${systemConfig.prefixAdmin}/roles`)
} 

module.exports.edit = async (req, res) => {
    
    try {
        const id= req.params.id;

        let find = {
            _id:id,
            deleted: false
        };

        const data = await Role.findOne(find);

        res.render("admin/pages/roles/edit", {
            pageTitle: "Chỉnh sửa nhóm quyền",
            data: data
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`)
    }
}


module.exports.editPatch = async (req, res) => {
    const id= req.params.id;

    await Role.updateOne({ _id: id }, req.body)
    req.flash("success", "Cập nhật nhóm quyền thành công")
    res.redirect("back")
    
}


module.exports.permissions = async (req, res) => {
    let find = {
        deleted: false
    };

    const records = await Role.find(find);

    res.render("admin/pages/roles/permissions", {
        pageTitle: "Phân quyền",
        records: records
    });
}


module.exports.permissionsPatch = async (req, res) => {
   const permissions = JSON.parse(req.body.permissions);
   for (const item of permissions){
    const id= item.id;
    const permissions= item.id;
    await Role.updateOne({_id: item.id}, {permission: item.permissions});
   }
   req.flash("success", "Cập nhật phân quyền thành công")
   res.redirect("back");
};