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
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserDataByEmail = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = require("bcryptjs");
const UserSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
    },
    status: {
        type: String,
    },
    date: {
        type: Date,
    }
});
UserSchema.methods.encryptPassword = (password) => (0, bcryptjs_1.hashSync)(password, (0, bcryptjs_1.genSaltSync)(10));
const User = (0, mongoose_1.model)("User", UserSchema);
const findUserDataByEmail = (email_f) => __awaiter(void 0, void 0, void 0, function* () {
    return yield User.find({
        email: email_f,
    });
});
exports.findUserDataByEmail = findUserDataByEmail;
exports.default = User;
//# sourceMappingURL=User.js.map