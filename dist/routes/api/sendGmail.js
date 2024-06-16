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
const nodemailer_1 = __importDefault(require("nodemailer"));
const router = express_1.default.Router();
router.post("/send/:gmail", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const gmail = req.params.gmail;
    const mailTransporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: "smart163410@gmail.com",
            pass: "gdobzmpamouonfjg",
        },
    });
    try {
        const res = yield mailTransporter.sendMail({
            from: "smart163410@gmail.com",
            to: gmail,
            subject: "Email Verification",
            html: "Invite my performance system website(url: https://perf-sys-frontend.vercel.app/)",
        });
        console.log(res);
    }
    catch (error) {
        console.log(error);
    }
}));
exports.default = router;
//# sourceMappingURL=sendGmail.js.map