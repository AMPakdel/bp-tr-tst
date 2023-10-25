import express, { Express, Request, Response, Application } from "express";
import { PortalMellat } from "./mellat";

//For env File

const app: Application = express();
const port = 9090;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db: any = {
  payerId: "abcd-1234-amir-abcd-1234",
  invoices: {},
  refIds: {},
};

app.get("/test-api", (req: Request, res: Response) => {
  res.send("Welcome to Express & TypeScript Server");
});

app.post("/test-api/create-invoice", (req: Request, res: Response) => {
  const { invoice_id, amount } = req.body;
  db.invoices[invoice_id] = {
    invoice_id,
    amount,
  };
  res.json({ error: null, data: db.invoices[invoice_id] });
});

app.post("/test-api/create-payment-ref-id", (req: Request, res: Response) => {
  const { invoice_id } = req.body;
  const invoice = db.invoices[invoice_id];

  const portal = new PortalMellat();

  portal.paymentRequest(
    {
      amount: invoice.amount,
      orderId: invoice_id,
      //payerId: "12345", //db.payerId,
      callbackUrl: "https://cipherland.ir/transaction-result",
    },
    (err: Error, result: any) => {
      if (err) {
        res.json({
          error: err,
          data: null,
        });
      } else {
        db.refIds[invoice_id] = result;
        res.json({ error: null, data: result });
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
