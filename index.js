const express = require("express");
const path= require("path");
const methodOverride= require("method-override");
const bodyParser = require('body-parser');
const flash= require("express-flash");
const cookieParser= require("cookie-parser");
const session= require("express-session");
require("dotenv").config();

const database = require("./config/database");

const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");

database.connect();

const systemConfig = require("./config/system");

const app = express();
const port = process.env.PORT;

app.use(bodyParser.urlencoded({extended: false}));

app.use(methodOverride('_method'));

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// Flash
app.use(cookieParser('PNPT266'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// End Flash

// Tiny MCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

app.locals.prefixAdmin = systemConfig.prefixAdmin;


app.use(express.static(`${__dirname}/public`));

// Routes
route(app);
routeAdmin(app);
app.get("*", (req, res) => {
    res.render("client/pages/errors/404", {
        pageTitle: "404 Not Found"
    });
});


app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});