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
const Wallet_1 = __importDefault(require("../../models/Wallet"));
const router = express_1.default.Router();
router.post("/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("----------->wallet---->", req.body);
    const wallet_new = new Wallet_1.default({
        wallet_address: req.body.wallet_address,
    });
    try {
        const { wallet_address } = req.body;
        let wallet_check = yield Wallet_1.default.findOne({ wallet_address });
        if (wallet_check) {
            return res.json(wallet_check);
        }
        else {
            yield wallet_new.save();
            res.json(wallet_new);
        }
    }
    catch (error) {
        res.status(400).json({ msg: error });
    }
}));
router.post("/update/:wallet_address", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield Wallet_1.default.findOne({ wallet_address: req.params.wallet_address });
    console.log("requeset", req.body);
    if (wallet) {
        const updated_wallet = yield Wallet_1.default.findOneAndUpdate({ wallet_address: req.params.wallet_address }, { balance: req.body.balance, energy: req.body.energy });
        //   console.log("--------------test----------",updated_wallet);
        const return_wallet = {
            _id: req.params.orderId,
            wallet_address: updated_wallet.wallet_address,
            balance: req.body.balance,
            energy: req.body.energy
        };
        return res.status(200).json(return_wallet);
    }
    else {
        return res.status(400).json({ msg: "You have no permission" });
    }
}));
router.get("/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const factories = yield Wallet_1.default.find();
    res.json(factories);
}));
router.delete("/delete/:wallet_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let wallet = yield Wallet_1.default.findOne({ _id: req.params.wallet_id });
    if (!wallet) {
        return res.status(404).json({ msg: "User not found." });
    }
    yield Wallet_1.default.deleteOne({ _id: req.params.wallet_id });
    res.json({ msg: "Delete Successfully" });
}));
exports.default = router;
//# sourceMappingURL=wallet.js.map