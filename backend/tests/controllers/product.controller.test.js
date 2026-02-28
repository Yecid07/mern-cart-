import { afterEach, describe, expect, it, vi } from "vitest";
import mongoose from "mongoose";
import Product from "../../models/product.model.js";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../../controllers/product.controller.js";
import { mockReq, mockRes } from "./test-helpers.js";

describe("product.controller", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("getProducts returns products", async () => {
    const res = mockRes();
    vi.spyOn(Product, "find").mockResolvedValue([{ name: "P1" }]);

    await getProducts(mockReq(), res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("getProducts handles db errors", async () => {
    const res = mockRes();
    vi.spyOn(Product, "find").mockRejectedValue(new Error("db"));

    await getProducts(mockReq(), res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("createProduct validates required fields", async () => {
    const res = mockRes();

    await createProduct(mockReq({ body: { name: "Only name" } }), res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("createProduct saves a product", async () => {
    const res = mockRes();
    vi.spyOn(Product.prototype, "save").mockResolvedValue();

    await createProduct(
      mockReq({ body: { name: "Mouse", price: 20, image: "https://img.test/mouse.png" } }),
      res
    );

    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("createProduct handles save errors", async () => {
    const res = mockRes();
    vi.spyOn(Product.prototype, "save").mockRejectedValue(new Error("save failed"));

    await createProduct(
      mockReq({ body: { name: "Mouse", price: 20, image: "https://img.test/mouse.png" } }),
      res
    );

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("updateProduct rejects invalid id", async () => {
    const res = mockRes();
    vi.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(false);

    await updateProduct(mockReq({ params: { id: "bad-id" }, body: {} }), res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("updateProduct updates by id", async () => {
    const res = mockRes();
    vi.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
    vi.spyOn(Product, "findByIdAndUpdate").mockResolvedValue({ _id: "1", name: "Updated" });

    await updateProduct(
      mockReq({ params: { id: "65f1c9b3c6b5a1a1a1a1a1a1" }, body: { name: "Updated" } }),
      res
    );

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("updateProduct handles db errors", async () => {
    const res = mockRes();
    vi.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
    vi.spyOn(Product, "findByIdAndUpdate").mockRejectedValue(new Error("db"));

    await updateProduct(
      mockReq({ params: { id: "65f1c9b3c6b5a1a1a1a1a1a1" }, body: { name: "Updated" } }),
      res
    );

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("deleteProduct rejects invalid id", async () => {
    const res = mockRes();
    vi.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(false);

    await deleteProduct(mockReq({ params: { id: "bad-id" } }), res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("deleteProduct deletes by id", async () => {
    const res = mockRes();
    vi.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
    vi.spyOn(Product, "findByIdAndDelete").mockResolvedValue({ _id: "1" });

    await deleteProduct(mockReq({ params: { id: "65f1c9b3c6b5a1a1a1a1a1a1" } }), res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("deleteProduct handles db errors", async () => {
    const res = mockRes();
    vi.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
    vi.spyOn(Product, "findByIdAndDelete").mockRejectedValue(new Error("db"));

    await deleteProduct(mockReq({ params: { id: "65f1c9b3c6b5a1a1a1a1a1a1" } }), res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
