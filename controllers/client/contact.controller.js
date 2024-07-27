module.exports.index = async (req, res) => {
    res.render("client/pages/contact/index", {
        pageTitle: "Trang liên hệ"
    });
}