module.exports.registerPost = (req,res, next) => {
    if(!req.body.firstName){
        req.flash("error", `Vui lòng nhập tên`);
        res.redirect("back");
        return;
    }
    if(!req.body.lastName){
        req.flash("error", `Vui lòng nhập họ`);
        res.redirect("back");
        return;
    }
    if(!req.body.email){
        req.flash("error", `Vui lòng nhập email`);
        res.redirect("back");
        return;
    }
    if(!req.body.password){
        req.flash("error", `Vui lòng nhập password`);
        res.redirect("back");
        return;
    }
    if(!req.body.phone){
        req.flash("error", `Vui lòng nhập số điện thoại`);
        res.redirect("back");
        return;
    }

    next();
}

module.exports.loginPost = (req,res, next) => {
    if(!req.body.email){
        req.flash("error", `Vui lòng nhập email`);
        res.redirect("back");
        return;
    }
    if(!req.body.password){
        req.flash("error", `Vui lòng nhập password`);
        res.redirect("back");
        return;
    }

    next();
}

module.exports.resetPasswordPost = (req,res, next) => {
    if(!req.body.password){
        req.flash("error", `Vui lòng nhập mật khẩu`);
        res.redirect("back");
        return;
    }
    if(!req.body.confirmPassword){
        req.flash("error", `Vui lòng xác nhận lại mật khẩu`);
        res.redirect("back");
        return;
    }

    if(req.body.password != req.body.confirmPassword){
        req.flash("error", `Xác nhận mật khẩu không trùng khớp`);
        res.redirect("back");
        return;
    }

    next();
}