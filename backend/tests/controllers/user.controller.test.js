import { afterEach, describe, expect, it, vi } from "vitest";
import mongoose from "mongoose";
import User from "../../models/user.model.js";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "../../controllers/user.controller.js";
import { mockReq, mockRes } from "./test-helpers.js";

describe("user.controller", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("getUsers returns users", async () => {
    const res = mockRes();
    vi.spyOn(User, "find").mockResolvedValue([{ name: "Ana" }]);

    await getUsers(mockReq(), res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("getUsers handles db errors", async () => {
    const res = mockRes();
    vi.spyOn(User, "find").mockRejectedValue(new Error("db"));

    await getUsers(mockReq(), res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("createUser validates required fields", async () => {
    const res = mockRes();

    await createUser(mockReq({ body: { name: "Ana" } }), res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("createUser rejects duplicate email", async () => {
    const res = mockRes();
    vi.spyOn(User, "findOne").mockResolvedValue({ _id: "1" });

    await createUser(mockReq({ body: { name: "Ana", email: "ana@test.com" } }), res);

    expect(res.status).toHaveBeenCalledWith(409);
  });

  it("createUser creates user", async () => {
    const res = mockRes();
    vi.spyOn(User, "findOne").mockResolvedValue(null);
    vi.spyOn(User.prototype, "save").mockResolvedValue();

    await createUser(mockReq({ body: { name: "Ana", email: "ana@test.com" } }), res);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("createUser handles db errors", async () => {
    const res = mockRes();
    vi.spyOn(User, "findOne").mockRejectedValue(new Error("db"));

    await createUser(mockReq({ body: { name: "Ana", email: "ana@test.com" } }), res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("updateUser rejects invalid id", async () => {
    const res = mockRes();
    vi.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(false);

    await updateUser(mockReq({ params: { id: "bad-id" }, body: { name: "x" } }), res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("updateUser rejects duplicate email", async () => {
    const res = mockRes();
    vi.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
    vi.spyOn(User, "findOne").mockResolvedValue({ _id: "u2" });

    await updateUser(
      mockReq({ params: { id: "65f1c9b3c6b5a1a1a1a1a1a1" }, body: { email: "ana@test.com" } }),
      res
    );

    expect(res.status).toHaveBeenCalledWith(409);
  });

  it("updateUser handles not found", async () => {
    const res = mockRes();
    vi.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
    vi.spyOn(User, "findByIdAndUpdate").mockResolvedValue(null);

    await updateUser(
      mockReq({ params: { id: "65f1c9b3c6b5a1a1a1a1a1a1" }, body: { name: "new" } }),
      res
    );

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("updateUser updates user", async () => {
    const res = mockRes();
    vi.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
    vi.spyOn(User, "findByIdAndUpdate").mockResolvedValue({ _id: "1", name: "new" });

    await updateUser(
      mockReq({ params: { id: "65f1c9b3c6b5a1a1a1a1a1a1" }, body: { name: "new" } }),
      res
    );

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("updateUser handles db errors", async () => {
    const res = mockRes();
    vi.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
    vi.spyOn(User, "findByIdAndUpdate").mockRejectedValue(new Error("db"));

    await updateUser(
      mockReq({ params: { id: "65f1c9b3c6b5a1a1a1a1a1a1" }, body: { name: "new" } }),
      res
    );

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("deleteUser rejects invalid id", async () => {
    const res = mockRes();
    vi.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(false);

    await deleteUser(mockReq({ params: { id: "bad-id" } }), res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("deleteUser handles user not found", async () => {
    const res = mockRes();
    vi.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
    vi.spyOn(User, "findByIdAndDelete").mockResolvedValue(null);

    await deleteUser(mockReq({ params: { id: "65f1c9b3c6b5a1a1a1a1a1a1" } }), res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("deleteUser deletes user", async () => {
    const res = mockRes();
    vi.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
    vi.spyOn(User, "findByIdAndDelete").mockResolvedValue({ _id: "1" });

    await deleteUser(mockReq({ params: { id: "65f1c9b3c6b5a1a1a1a1a1a1" } }), res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("deleteUser handles db errors", async () => {
    const res = mockRes();
    vi.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
    vi.spyOn(User, "findByIdAndDelete").mockRejectedValue(new Error("db"));

    await deleteUser(mockReq({ params: { id: "65f1c9b3c6b5a1a1a1a1a1a1" } }), res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
