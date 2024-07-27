const md5 = require("md5");

const User = require("../../models/user.model");

const ForgotPassword = require("../../models/forgot-password.model");

const Cart = require("../../models/cart.model");

const generateHelper = require("../../helper/generate");
const sendMailHelper = require("../../helper/sendMail");

module.exports.register = async (req, res) => {
    res.render("client/pages/user/register", {
        pageTitle: "Đăng ký tài khoản",
    });
}

module.exports.registerPost = async (req, res) => {
    const existEmail = await User.findOne({
        email: req.body.email,
        deleted: false
    });
    if(existEmail){
        req.flash("error", `Email đã tồn tại`);
        res.redirect("back");
        return;
    }
    req.body.password= md5(req.body.password);
    const user = new User(req.body);
    await user.save();
    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/");
}



module.exports.login = async (req, res) => {
    res.render("client/pages/user/login", {
        pageTitle: "Đăng nhập tài khoản",
    });
}

module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
        email: email,
        deleted: false
    });

    if(!user){
        req.flash("error", `Email không tồn tại`);
        res.redirect("back");
        return;
    }

    if(md5(password) != user.password){
        req.flash("error", `Sai mật khẩu`);
        res.redirect("back");
        return;
    }

    if(user.status == "inactive"){
        req.flash("error", `Tài khoản đang bị khóa`);
        res.redirect("back");
        return;
    }

    res.cookie("tokenUser", user.tokenUser);

    await Cart.updateOne({
        _id: req.cookies.cartId
    }, {
        user_id: user.id
    });

    res.redirect("/");
}


module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser");
    res.redirect("/");
}

module.exports.forgotPassword = async (req, res) => {
    res.render("client/pages/user/forgotPassword", {
        pageTitle: "Quên mật khẩu",
    });
}

module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email;

    const user = await User.findOne({
        email: email,
        deleted: false
    });

    if(!user){
        req.flash("error", `Email không tồn tại`);
        res.redirect("back");
        return;
    }

    const otp= generateHelper.generateRandomNumber(8);

    const objectForgotEmail = {
        email: email,
        otp: otp,
        expireAt: Date.now()
    };

    const forgotPassword = new ForgotPassword(objectForgotEmail);
    await forgotPassword.save();
    
    const subject = `Mã OTP xác minh lấy lại mật khẩu`;
    const html = `Mã OTP xác minh lấy lại mật khẩu là <b>${otp}</b>. <br>Thời hạn sử dụng là 3 phút. <br> <b>Lưu ý </b> không để lộ mã OTP.`;

    sendMailHelper.sendMail(email, subject, html);

    res.redirect(`/user/password/otp?email=${email}`);
}


module.exports.otpPassword = async (req, res) => {
    const email = req.query.email;

    res.render("client/pages/user/otp-password", {
        pageTitle: "Nhập mã OTP",
        email: email
    });
}

module.exports.otpPasswordPost = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    });

    if(!result){
        req.flash("error", `OTP không hợp lệ`);
        res.redirect("back");
        return;
    }

    const user = await User.findOne({
        email: email
    });

    res.cookie("tokenUser", user.tokenUser);

    res.redirect("/user/password/reset");
}


module.exports.resetPassword = async (req, res) => {
    
    res.render("client/pages/user/reset-password", {
        pageTitle: "Đổi mật khẩu"
    });
}

module.exports.resetPasswordPost = async (req, res) => {
    const password = req.body.password;
    const tokenUser = req.cookies.tokenUser;

    await User.updateOne({
        tokenUser: tokenUser
    }, {
        password: md5(password)
    });
    res.redirect("/");
}


module.exports.info = async (req, res) => {
    res.render("client/pages/user/info", {
        pageTitle: "Thông tin tài khoản"
    });
}


module.exports.editInfoPatch = async (req, res) => {
    const id= res.locals.user.id;
    try {
        await User.updateOne( {_id: id}, req.body);
        req.flash("success", `Cập nhật thông tin thành công!`);
    } catch (error) {
        req.flash("error", `Cập nhật thông tin thất bại!`);
    }
    
    res.redirect("back");
}