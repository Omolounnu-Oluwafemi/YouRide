"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const config_1 = require("./config/config");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_docs_1 = __importDefault(require("./swagger.docs"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const passport_2 = __importDefault(require("./config/passport"));
const drivers_1 = __importDefault(require("./routes/drivers"));
const usersRoute_1 = __importDefault(require("./routes/usersRoute"));
const admin_1 = __importDefault(require("./routes/admin"));
const app = (0, express_1.default)();
app.use((0, express_session_1.default)({
    secret: process.env.COOKIE_KEY,
    resave: false,
    saveUninitialized: false,
}));
config_1.sequelize
    .sync()
    .then(() => {
    console.log("database synced sucessfully");
})
    .catch((err) => {
    console.log(err);
});
// Initialize Passport.js
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
(0, dotenv_1.config)();
(0, passport_2.default)(config_1.sequelize);
// passportSetup();
// view engine setup
app.set('views', path_1.default.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use('/user', usersRoute_1.default);
app.use('/driver', drivers_1.default);
app.use('/admin', admin_1.default);
// SWAGGER
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_docs_1.default));
// catch 404 and forward to error handler
app.use((req, res, next) => {
    next((0, http_errors_1.default)(404));
});
// error handler
app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
exports.default = app;
