import { jest } from "@jest/globals";

export interface MockQueryResult<T = any> {
  rows: T[];
  rowCount?: number;
  command?: string;
  oid?: number;
  fields?: any[];
}

export type MockQueryFunction = (...args: any[]) => Promise<MockQueryResult>;

export const mockQuery = jest.fn<MockQueryFunction>();

export const mockPool = {
  query: mockQuery,
  on: jest.fn(),
};

export default mockPool;
