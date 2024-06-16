"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const User_1 = __importDefault(require("../models/User"));
function default_1(req, res, next) {
    const token = req.headers["x-auth-token"];
    if (!token) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }
    try {
        jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret, (error, decoded) => {
            if (error) {
                return res.status(401).json({ msg: "Token is not valid" });
            }
            else {
                User_1.default.findById(decoded._id).then((user) => {
                    req.user = user;
                    next();
                }).catch(() => {
                    return res.status(401).json({ msg: "Token is not valid" });
                });
            }
        });
    }
    catch (err) {
        console.error("something wrong with auth middleware");
        res.status(500).json({ msg: "Server Error" });
    }
}
exports.default = default_1;
//# sourceMappingURL=auth.js.map