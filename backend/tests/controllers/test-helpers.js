import { vi } from "vitest";

export const mockReq = ({ body = {}, params = {} } = {}) => ({ body, params });

export const mockRes = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};
