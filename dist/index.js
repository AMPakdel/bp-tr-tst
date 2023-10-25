"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mellat_1 = require("./mellat");
//For env File
const app = (0, express_1.default)();
const port = 9090;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const db = {
    payerId: "abcd-1234-amir-abcd-1234",
    invoices: {},
    refIds: {},
};
app.get("/test-api", (req, res) => {
    res.send("Welcome to Express & TypeScript Server");
});
app.post("/test-api/create-invoice", (req, res) => {
    const { invoice_id, amount } = req.body;
    db.invoices[invoice_id] = {
        invoice_id,
        amount,
    };
    res.json({ error: null, data: db.invoices[invoice_id] });
});
app.post("/test-api/create-payment-ref-id", (req, res) => {
    const { invoice_id } = req.body;
    const invoice = db.invoices[invoice_id];
    const portal = new mellat_1.PortalMellat();
    portal.paymentRequest({
        amount: invoice.amount,
        orderId: invoice_id,
        //payerId: "12345", //db.payerId,
        callbackUrl: "https://cipherland.ir/transaction-result",
    }, (err, result) => {
        if (err) {
            res.json({
                error: err,
                data: null,
            });
        }
        else {
            db.refIds[invoice_id] = result;
            res.json({ error: null, data: result });
        }
    });
});
app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});
