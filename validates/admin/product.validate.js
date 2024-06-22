module.exports.createPost = (req,res, next) => {
    if(!req.body.title){
        req.flash("error", `Vui lòng nhập tiêu đề`);
        res.redirect("back");
        return;
    }
    if(!req.body.category){
        req.flash("error", `Vui lòng nhập danh mục`);
        res.redirect("back");
        return;
    }
    next();
}