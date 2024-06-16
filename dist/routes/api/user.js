"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const User_1 = __importDefault(require("../../models/User"));
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const router = express_1.default.Router();
router.post("/register", [
    (0, express_validator_1.check)("username", "username is required").notEmpty(),
    (0, express_validator_1.check)("password", "Password length should be 6 to 40 characters").isLength({
        min: 6,
        max: 40,
    }),
    (0, express_validator_1.check)("email", "email must be required").notEmpty(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email } = req.body;
    let user = yield User_1.default.findOne({ email });
    if (user) {
        return res.status(400).json({ errors: [{ msg: "Email already exists" }] });
    }
    const currentDate = new Date();
    let amount = (yield User_1.default.find()).length;
    if (amount === 0) {
        user = new User_1.default(Object.assign(Object.assign({}, req.body), { role: "admin", status: "verified", date: currentDate }));
    }
    else {
        user = new User_1.default(Object.assign(Object.assign({}, req.body), { role: "user", status: "verified", date: currentDate }));
    }
    user.password = user.encryptPassword(user.password);
    yield user.save();
    res.json({ msg: "Successfully registered" });
}));
// route: api/user/login
// description: user login and return jwt
// method: POST and it's public
router.post("/login", [
    (0, express_validator_1.check)("username", "Username is required").notEmpty(),
    (0, express_validator_1.check)("password", "Password is required").notEmpty(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;
    const user = yield User_1.default.findOne({ username });
    if (!user) {
        return res.status(404).json({ errors: [{ msg: "User not found" }] });
    }
    const compare = (0, bcryptjs_1.compareSync)(password, user.password);
    if (!compare) {
        return res.status(400).json({ errors: [{ msg: "Password incorrect" }] });
    }
    const payload = {
        _id: user._id,
        username,
        role: user.role,
        status: user.status,
    };
    jsonwebtoken_1.default.sign(payload, config_1.default.jwtSecret, { expiresIn: "1 days" }, (err, token) => {
        if (err)
            throw err;
        res.json({ token: token, user });
    });
}));
// route: api/user/auth
// description: currnet user's info
// method: get and it's private
router.get("/auth", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.user._id).select(["-password"]);
        res.json({ user });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}));
// route: api/user/all
// description: currnet user's info
// method: get and it's private only for admin
router.get("/all", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.role !== "admin") {
        return res
            .status(400)
            .json({ msg: "You don't have permission to get data" });
    }
    const users = yield User_1.default.find().sort("firstname");
    res.json(users);
}));
router.get("/getid/all", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.role !== "admin") {
        return res
            .status(400)
            .json({ msg: "You don't have permission to get data" });
    }
    const users = yield User_1.default.find()
        .select(["_id", "email", "role"])
        .sort({ groupid: "asc" });
    res.json(users);
}));
// route: api/user/update
// description: update user's info
// method: Put and it's private only for admin
router.put("/update", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findById(req.body.id);
    if (!user)
        return res.status(404).json({ msg: "User Not Found" });
    if (req.user.role === "admin" || req.user._id === user._id.toString()) {
        if (req.user.role !== "admin") {
            const { email } = req.body;
            let userByEmail = yield User_1.default.findOne({ email });
            if (userByEmail) {
                if (userByEmail._id.toString() !== req.user._id) {
                    return res.status(400).json({
                        errors: [{ msg: "User already exists. Use another email" }],
                    });
                }
            }
        }
        let newUser = yield User_1.default.findOneAndUpdate({ _id: req.body.id }, { $set: req.body }, { new: true, upsert: true, setDefaultsOnInsert: true });
        return res.json({ msg: "Update Successfuly" });
    }
    return res.status(400).json({ msg: "No Permission to handle this action" });
}));
// route: api/user/delete/:user_id
// description: Delete user
// method: DELETE and it's private (Only Admin)
router.delete("/delete/:user_id", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield User_1.default.findOne({ _id: req.params.user_id });
    if (!user) {
        return res.status(404).json({ msg: "User not found." });
    }
    if (req.user.role !== "admin") {
        return res
            .status(400)
            .json({ msg: "You don't have permission to delete user" });
    }
    yield User_1.default.deleteOne({ _id: req.params.user_id });
    res.json(req.params.user_id);
}));
exports.default = router;
//# sourceMappingURL=user.js.map