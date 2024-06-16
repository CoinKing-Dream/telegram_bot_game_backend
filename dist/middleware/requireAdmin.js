"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }
    else if (req.user.role !== "admin") {
        return res.status(400).json({ msg: "No token, authorization denied" });
    }
    else {
        next();
    }
}
exports.default = default_1;
//# sourceMappingURL=requireAdmin.js.map