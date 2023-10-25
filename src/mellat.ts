import { createClient } from "soap";

type CreatePaymentRequestParams = {
  amount: number;
  orderId: string;
  callbackUrl: string;
  additionalData?: string; // max length 1000
  payerId?: string;
};

type RefPaymentParams = {
  orderId: number;
  saleOrderId: number;
  saleReferenceId: string;
};

export class PortalMellat {
  config: any;
  client: any;
  constructor(userConfig?: any) {
    this.config = Object.assign(mellatConfig, userConfig);
    this.client = null;
  }

  initialize(callback: Function) {
    if (!callback) {
      return new Promise((resolve, reject) => {
        this.initialize((error: Error, res: any) => {
          if (error) {
            return reject(error);
          }
          return resolve(res);
        });
      });
    }

    return createClient(
      this.config.apiUrl,
      {
        envelopeKey: "x",
        overrideRootElement: {
          namespace: "ns1",
        },
        wsdl_options: {
          timeout: this.config.timeout,
        },
      },
      (error, client) => {
        if (error) {
          return callback(error);
        }
        this.client = client;
        return callback(null);
      }
    );
  }

  initializeIfNotInitialized(callback: Function) {
    if (!callback) {
      return new Promise((resolve, reject) => {
        this.initializeIfNotInitialized((error: Error, res: any) => {
          if (error) {
            return reject(error);
          }
          return resolve(res);
        });
      });
    }
    if (this.client) {
      return callback();
    }
    return this.initialize((error: Error) => callback(error));
  }

  paymentRequest(
    {
      amount,
      orderId,
      callbackUrl,
      additionalData,
      payerId,
    }: CreatePaymentRequestParams,
    callback: Function
  ) {
    if (!callback) {
      return new Promise((resolve, reject) => {
        this.paymentRequest(
          { amount, orderId, callbackUrl, additionalData, payerId },
          (error: Error, res: any) => {
            if (error) {
              return reject(error);
            }
            return resolve(res);
          }
        );
      });
    }
    return this.initializeIfNotInitialized((error: Error) => {
      if (error) {
        return callback(error);
      }
      const now = new Date();
      const args = {
        orderId,
        amount,
        terminalId: this.config.terminalId,
        userName: this.config.username,
        userPassword: this.config.password,
        localDate: now.toISOString().slice(0, 10).replace(/-/g, ""),
        localTime: `${now.getHours()}${now.getMinutes()}${now.getSeconds()}`,
        callBackUrl: callbackUrl,
        payerId: payerId || 0,
        additionalData,
      };
      return this.client.bpPayRequest(args, (error: Error, result: any) => {
        if (error) {
          return callback(error);
        }
        const parsed = result.return.split(",");
        if (parsed.length < 2) {
          return callback(null, {
            resCode: Number(parsed[0]),
            rawResCode: parsed[0],
            refId: null,
          });
        }
        const refId = parsed[1];
        return callback(null, {
          resCode: 0,
          rawResCode: "0",
          refId,
        });
      });
    });
  }

  verifyPayment(
    { orderId, saleOrderId, saleReferenceId }: RefPaymentParams,
    callback: Function
  ) {
    if (!callback) {
      return new Promise((resolve, reject) => {
        this.verifyPayment(
          { orderId, saleOrderId, saleReferenceId },
          (error: Error, res: any) => {
            if (error) {
              return reject(error);
            }
            return resolve(res);
          }
        );
      });
    }
    return this.initializeIfNotInitialized((error: Error) => {
      if (error) {
        return callback(error);
      }
      const args = {
        orderId,
        saleOrderId,
        saleReferenceId,
        terminalId: this.config.terminalId,
        userName: this.config.username,
        userPassword: this.config.password,
      };
      return this.client.bpVerifyRequest(args, (error: Error, result: any) => {
        if (error) {
          return callback(error);
        }
        return callback(null, {
          resCode: Number(result.return),
          rawResCode: result.return,
        });
      });
    });
  }

  settlePayment(
    { orderId, saleOrderId, saleReferenceId }: RefPaymentParams,
    callback: Function
  ) {
    if (!callback) {
      return new Promise((resolve, reject) => {
        this.settlePayment(
          { orderId, saleOrderId, saleReferenceId },
          (error: Error, res: any) => {
            if (error) {
              return reject(error);
            }
            return resolve(res);
          }
        );
      });
    }
    return this.initializeIfNotInitialized((error: Error) => {
      if (error) {
        return callback(error);
      }
      const args = {
        orderId,
        saleOrderId,
        saleReferenceId,
        terminalId: this.config.terminalId,
        userName: this.config.username,
        userPassword: this.config.password,
      };
      return this.client.bpSettleRequest(args, (error: Error, result: any) => {
        if (error) {
          return callback(error);
        }
        return callback(null, {
          resCode: Number(result.return),
          rawResCode: result.return,
        });
      });
    });
  }

  inquiryRequest(
    { orderId, saleOrderId, saleReferenceId }: RefPaymentParams,
    callback: Function
  ) {
    if (!callback) {
      return new Promise((resolve, reject) => {
        this.inquiryRequest(
          { orderId, saleOrderId, saleReferenceId },
          (error: Error, res: any) => {
            if (error) {
              return reject(error);
            }
            return resolve(res);
          }
        );
      });
    }
    return this.initializeIfNotInitialized((error: Error) => {
      if (error) {
        return callback(error);
      }
      const args = {
        orderId,
        saleOrderId,
        saleReferenceId,
        terminalId: this.config.terminalId,
        userName: this.config.username,
        userPassword: this.config.password,
      };
      return this.client.bpInquiryRequest(args, (error: Error, result: any) => {
        if (error) {
          return callback(error);
        }
        return callback(null, {
          resCode: Number(result.return),
          rawResCode: result.return,
        });
      });
    });
  }

  reversalRequest(
    { orderId, saleOrderId, saleReferenceId }: RefPaymentParams,
    callback: Function
  ) {
    if (!callback) {
      return new Promise((resolve, reject) => {
        this.reversalRequest(
          { orderId, saleOrderId, saleReferenceId },
          (error: Error, res: any) => {
            if (error) {
              return reject(error);
            }
            return resolve(res);
          }
        );
      });
    }
    return this.initializeIfNotInitialized((error: Error) => {
      if (error) {
        return callback(error);
      }
      const args = {
        orderId,
        saleOrderId,
        saleReferenceId,
        terminalId: this.config.terminalId,
        userName: this.config.username,
        userPassword: this.config.password,
      };
      return this.client.bpReversalRequest(
        args,
        (error: Error, result: any) => {
          if (error) {
            return callback(error);
          }
          return callback(null, {
            resCode: Number(result.return),
            rawResCode: result.return,
          });
        }
      );
    });
  }
}

export const mellatConfig = {
  apiUrl: "https://bpm.shaparak.ir/pgwchannel/services/pgw?wsdl",
  terminalId: "7271017",
  username: "7271017",
  password: "61941259",
  timeout: 10000,
};
