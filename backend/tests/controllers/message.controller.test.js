import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import User from "../../models/user.model.js";
import { enrichMessage, processMessage } from "../../controllers/message.controller.js";
import { mockReq, mockRes } from "./test-helpers.js";

describe("message.controller", () => {
  const originalFetch = global.fetch;
  const originalSebasUrl = process.env.SEBASTIAN_MESSAGE_API_URL;

  beforeEach(() => {
    process.env.SEBASTIAN_MESSAGE_API_URL = "https://sebas.example.com/api/v2/mensaje";
  });

  afterEach(() => {
    vi.restoreAllMocks();
    global.fetch = originalFetch;
    process.env.SEBASTIAN_MESSAGE_API_URL = originalSebasUrl;
  });

  it("processMessage validates incoming message objects", async () => {
    const res = mockRes();

    await processMessage(mockReq({ body: {} }), res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("processMessage validates downstream URL configuration", async () => {
    const res = mockRes();
    process.env.SEBASTIAN_MESSAGE_API_URL = "";
    vi.spyOn(User, "findOne").mockReturnValue({
      lean: vi.fn().mockResolvedValue({ _id: "u1", name: "Ana" }),
    });

    await processMessage(mockReq({ body: { objetosMensaje: [{ cuidador: { id: "c1" } }] } }), res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("processMessage appends user and propagates Sebas response", async () => {
    const res = mockRes();
    vi.spyOn(User, "findOne").mockReturnValue({
      lean: vi.fn().mockResolvedValue({ _id: "u1", name: "Ana", email: "ana@test.com" }),
    });

    const downstreamPayload = { success: true, objetosMensaje: [{ cuidador: { id: "c1" } }, { usuario: { _id: "u1" } }, { vehiculo: { id: "v1" } }] };
    const json = vi.fn().mockResolvedValue(downstreamPayload);
    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json,
    });

    await processMessage(
      mockReq({
        body: {
          objetosMensaje: [{ cuidador: { id: "c1", nombre: "Carlos" } }],
          metadata: { traceId: "abc" },
        },
      }),
      res
    );

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://sebas.example.com/api/v2/mensaje",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
    );

    const sentBody = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(sentBody.objetosMensaje).toEqual([
      { cuidador: { id: "c1", nombre: "Carlos" } },
      { usuario: { _id: "u1", name: "Ana", email: "ana@test.com" } },
    ]);
    expect(sentBody.metadata).toEqual(
      expect.objectContaining({
        traceId: "abc",
        yecidService: "Users API - Cloud Run (GCP)",
      })
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(downstreamPayload);
  });

  it("enrichMessage appends a user to the message", async () => {
    const res = mockRes();
    vi.spyOn(User, "findOne").mockReturnValue({
      lean: vi.fn().mockResolvedValue({ _id: "u1", name: "Ana" }),
    });

    await enrichMessage(
      mockReq({ body: { objetosMensaje: [{ cuidador: { id: "c1" } }] } }),
      res
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        objetosMensaje: [{ cuidador: { id: "c1" } }, { usuario: { _id: "u1", name: "Ana" } }],
      })
    );
  });
});
