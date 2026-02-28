import { afterEach, describe, expect, it, vi } from "vitest";
import mongoose from "mongoose";
import Order from "../../models/order.model.js";
import User from "../../models/user.model.js";
import {
  createOrder,
  deleteOrder,
  getOrders,
  updateOrder,
} from "../../controllers/order.controller.js";
import { mockReq, mockRes } from "./test-helpers.js";

const createPopulateQuery = (value) => {
  const secondPopulate = vi.fn().mockResolvedValue(value);
  const firstPopulate = vi.fn().mockReturnValue({ populate: secondPopulate });
  return { populate: firstPopulate };
};

describe("order.controller", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("getOrders returns populated orders", async () => {
    const res = mockRes();
    vi.spyOn(Order, "find").mockReturnValue(createPopulateQuery([{ _id: "1" }]));

    await getOrders(mockReq(), res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("getOrders handles db errors", async () => {
    const res = mockRes();
    vi.spyOn(Order, "find").mockImplementation(() => {
      throw new Error("db");
    });

    await getOrders(mockReq(), res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("createOrder validates required order fields", async () => {
    const res = mockRes();

    await createOrder(mockReq({ body: { items: [] } }), res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("createOrder rejects invalid user id", async () => {
    const res = mockRes();
    vi.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(false);

    await createOrder(
      mockReq({
        body: {
          user: "bad-id",
          items: [{ product: "x", quantity: 1, price: 50 }],
        },
      }),
      res
    );

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("createOrder rejects non-existing user", async () => {
    const res = mockRes();
    vi.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
    vi.spyOn(User, "findById").mockResolvedValue(null);

    await createOrder(
      mockReq({
        body: {
          user: "65f1c9b3c6b5a1a1a1a1a1a1",
          items: [{ product: "x", quantity: 1, price: 50 }],
        },
      }),
      res
    );

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("createOrder creates order", async () => {
    const res = mockRes();
    vi.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
    vi.spyOn(User, "findById").mockResolvedValue({ _id: "u1" });
    vi.spyOn(Order.prototype, "save").mockResolvedValue();
    vi.spyOn(Order, "findById").mockReturnValue(createPopulateQuery({ _id: "o1" }));

    await createOrder(
      mockReq({
        body: {
          user: "65f1c9b3c6b5a1a1a1a1a1a1",
          items: [{ product: "65f1c9b3c6b5a1a1a1a1a1a2", quantity: 2, price: 50 }],
        },
      }),
      res
    );

    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("createOrder handles db errors", async () => {
    const res = mockRes();
    vi.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
    vi.spyOn(User, "findById").mockRejectedValue(new Error("db"));

    await createOrder(
      mockReq({
        body: {
          user: "65f1c9b3c6b5a1a1a1a1a1a1",
          items: [{ product: "65f1c9b3c6b5a1a1a1a1a1a2", quantity: 2, price: 50 }],
        },
      }),
      res
    );

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("updateOrder validates target order id", async () => {
    const res = mockRes();
    vi.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(false);

    await updateOrder(mockReq({ params: { id: "bad-id" }, body: {} }), res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("updateOrder validates new user id format", async () => {
    const res = mockRes();
    const isValidMock = vi.spyOn(mongoose.Types.ObjectId, "isValid");
    isValidMock.mockImplementation((value) => value !== "bad-user");

    await updateOrder(
      mockReq({
        params: { id: "65f1c9b3c6b5a1a1a1a1a1a1" },
        body: { user: "bad-user" },
      }),
      res
    );

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("updateOrder validates new user existence", async () => {
    const res = mockRes();
    vi.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
    vi.spyOn(User, "findById").mockResolvedValue(null);

    await updateOrder(
      mockReq({
        params: { id: "65f1c9b3c6b5a1a1a1a1a1a1" },
        body: { user: "65f1c9b3c6b5a1a1a1a1a1a9" },
      }),
      res
    );

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("updateOrder updates order", async () => {
    const res = mockRes();
    vi.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
    vi.spyOn(User, "findById").mockResolvedValue({ _id: "u1" });
    vi.spyOn(Order, "findByIdAndUpdate").mockReturnValue(createPopulateQuery({ _id: "o1" }));

    await updateOrder(
      mockReq({
        params: { id: "65f1c9b3c6b5a1a1a1a1a1a1" },
        body: {
          user: "65f1c9b3c6b5a1a1a1a1a1a9",
          items: [{ product: "65f1c9b3c6b5a1a1a1a1a1a2", quantity: 1, price: 99 }],
        },
      }),
      res
    );

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("updateOrder handles order not found", async () => {
    const res = mockRes();
    vi.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
    vi.spyOn(Order, "findByIdAndUpdate").mockReturnValue(createPopulateQuery(null));

    await updateOrder(
      mockReq({
        params: { id: "65f1c9b3c6b5a1a1a1a1a1a1" },
        body: { status: "paid" },
      }),
      res
    );

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("updateOrder handles db errors", async () => {
    const res = mockRes();
    vi.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
    vi.spyOn(Order, "findByIdAndUpdate").mockRejectedValue(new Error("db"));

    await updateOrder(
      mockReq({
        params: { id: "65f1c9b3c6b5a1a1a1a1a1a1" },
        body: { status: "paid" },
      }),
      res
    );

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("deleteOrder validates id", async () => {
    const res = mockRes();
    vi.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(false);

    await deleteOrder(mockReq({ params: { id: "bad-id" } }), res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("deleteOrder handles order not found", async () => {
    const res = mockRes();
    vi.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
    vi.spyOn(Order, "findByIdAndDelete").mockResolvedValue(null);

    await deleteOrder(mockReq({ params: { id: "65f1c9b3c6b5a1a1a1a1a1a1" } }), res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("deleteOrder deletes order", async () => {
    const res = mockRes();
    vi.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
    vi.spyOn(Order, "findByIdAndDelete").mockResolvedValue({ _id: "1" });

    await deleteOrder(mockReq({ params: { id: "65f1c9b3c6b5a1a1a1a1a1a1" } }), res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("deleteOrder handles db errors", async () => {
    const res = mockRes();
    vi.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
    vi.spyOn(Order, "findByIdAndDelete").mockRejectedValue(new Error("db"));

    await deleteOrder(mockReq({ params: { id: "65f1c9b3c6b5a1a1a1a1a1a1" } }), res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
