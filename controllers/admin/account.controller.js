const md5= require("md5");
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const filterStatusHelper = require("../../helper/filterStatus");
const searchHelper = require("../../helper/search");
const paginationHelper = require("../../helper/pagination");

const systemConfig = require("../../config/system");


module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };
    
    const filterStatus= filterStatusHelper(req.query);
    if(req.query.status) {
        find.status = req.query.status;
    }
    
    const objectSearch = searchHelper(req.query);
    if(objectSearch.regex){
        find.fullName= objectSearch.regex;
    }
    
    // Pagination
    const countAccounts = await Account.countDocuments(find);
    let objectPagination = paginationHelper(
        {
        currentPage:1,
        limitItems: 4
        },
        req.query,
        countAccounts
    );
    // End Pagination


    const records = await Account.find(find).select("-password -token").limit(objectPagination.limitItems).skip(objectPagination.skip);

    for (const record of records){
        const role = await Role.findOne({
            _id: record.role_id,
            deleted:false,
            
        });
        record.role= role;
    }

    res.render("admin/pages/accounts/index", {
        pageTitle: "Danh sách tài khoản",
        records: records,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}


// GET /admin/accounts/change-status/:status/:id
module.exports.changeStatus = async (req,res) => {
    const status = req.params.status;
    const id = req.params.id;

    await Account.updateOne({_id:id}, {status:status});

    req.flash("success", "Cập nhật trạng thái tài khoản thành công!");
    res.redirect("back");
}

// DELETE /admin/accounts/delete/:id
module.exports.deleteItem = async (req,res) => {
    const id = req.params.id;
    await Account.updateOne({ _id: id}, { deleted: true, deleteAt: new Date()});
    req.flash("success", "Xóa thành công tài khoản!");
    res.redirect("back");
};

module.exports.create = async (req, res) => {
    const roles = await Role.find({
        deleted: false
    });
    res.render("admin/pages/accounts/create", {
        pageTitle: "Thêm mới tài khoản",
        roles: roles
    });
}

module.exports.createPost = async (req, res) => {
    const emailExist = await Account.findOne({
        email: req.body.email,
        deleted: false
    });

    console.log(emailExist);
    if(emailExist){
        req.flash("error", `Email ${req.body.email} đã tồn tại`);
        res.redirect("back");
    }else {
        req.body.password = md5(req.body.password);
        const record = new Account(req.body);
        await record.save();
        req.flash("success", `Tạo mới tài khoản thành công`);
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
    
}

module.exports.edit = async (req, res) => {
    let find = {
        _id: req.params.id,
        deleted: false,
    };
    
    try {
        const data = await Account.findOne(find);
        const roles = await Role.find({
            deleted: false,
        });

        res.render("admin/pages/accounts/edit", {
            pageTitle: "Chỉnh sửa tài khoản",
            data: data,
            roles: roles,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
}


module.exports.editPatch = async (req, res) => {
   
    const id = req.params.id;

    const emailExist = await Account.findOne({
        _id: { $ne: id},
        email: req.body.email,
        deleted: false
    });
    if(emailExist){
        req.flash("error", `Email ${req.body.email} đã tồn tại`);
    }else{
        if(req.body.password){
            req.body.password = md5(req.body.password);
        }else {
            delete req.body.password;
        }
        try {
            await Account.updateOne({ _id: id }, req.body);
            req.flash("success", "Cập nhật thành công!")
        } catch (error) {
            res.redirect(`${systemConfig.prefixAdmin}/accounts`)
        }
    }
    res.redirect("back");
};