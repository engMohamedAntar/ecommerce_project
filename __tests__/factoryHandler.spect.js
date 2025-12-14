const { getOne, getAll } = require("../services/factoryHandler.js");
const { createOne } = require("../services/factoryHandler.js");
const slugify = require("slugify");
jest.mock("slugify", () => jest.fn(() => "product"));

jest.mock("../utils/apiFeatures", () => {
  return jest.fn(() => ({
    paginate: jest.fn().mockReturnThis(),
    filter: jest.fn().mockReturnThis(),
    fieldFilter: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    search: jest.fn().mockReturnThis(),
    mongooseQuery: Promise.resolve(["doc1", "doc2", "doc3"]),
    paginationInfo: { limit: 10, page: 1 },
  }));
});

describe("getOne", () => {
  let mockReq;
  let mockRes;
  let mockNext;
  beforeEach(() => {
    mockReq = {
      params: {
        id: "123",
      },
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  it("should return product with id 123", async () => {
    const mockDoc = { id: "123", name: "product 1" };
    const mockQuery = {
      populate: jest.fn().mockReturnThis(),
      then: jest.fn((resolve) => resolve(mockDoc)),
    };

    const mockModel = {
      findById: jest.fn(() => mockQuery),
    };

    const handler = getOne(mockModel, "reviews");
    await handler(mockReq, mockRes, mockNext);

    expect(mockModel.findById).toHaveBeenCalled();
    expect(mockModel.findById).toHaveBeenCalledWith("123");

    expect(mockQuery.populate).toHaveBeenCalled();
    expect(mockQuery.populate).toHaveBeenCalledWith("reviews");

    expect(mockRes.status).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(200);

    expect(mockRes.json).toHaveBeenCalled();
    expect(mockRes.json).toHaveBeenCalledWith({ data: mockDoc });
  });

  it("should call next if no document returned", async () => {
    const mockQuery = {
      populate: jest.fn().mockReturnThis(),
      then: jest.fn((resolve) => resolve(null)),
    };
    const mockModel = {
      findById: jest.fn(() => mockQuery),
    };
    let handler = getOne(mockModel);
    await handler(mockReq, mockRes, mockNext);

    const error = mockNext.mock.calls[0][0];

    expect(mockNext).toHaveBeenCalled();
    expect(error.message).toBe("No document found for 123");
    expect(error.statusCode).toBe(404);
  });
});
 
describe("createOne", () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      body: {
        name: "product",
        slug: "lablabla",
      },
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  const mockDoc = { id: "123", name: "product 1" };
  
  const mockModel = {
    create: jest.fn().mockResolvedValue(mockDoc),
  };

  it("should create new product", async () => {
    const handler = createOne(mockModel);
    await handler(mockReq, mockRes, mockNext);

    expect(mockModel.create).toHaveBeenCalled();
    expect(mockModel.create).toHaveBeenCalledTimes(1);

    expect(mockRes.status).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(201);

    expect(mockRes.json).toHaveBeenCalled();
    expect(mockRes.json).toHaveBeenCalledWith({
      status: "success",
      data: mockDoc,
    });

    expect(mockModel.create).toHaveBeenCalledWith({
      name: "product",
      slug: "product",
    });

    expect(slugify).toHaveBeenCalled();
    expect(slugify).toHaveBeenCalledWith("product");

    expect(mockReq.body.slug).toBe("product");
  });

  it("kldjf", async () => {
    slugify.mockImplementationOnce(()=> 'product 2')
    const handler = createOne(mockModel);
    await handler(mockReq, mockRes, mockNext);
    expect(mockReq.body.slug).toBe("product 2");
  });
});

describe("getAll", () => {
  const mockQuery = {};
  const mockModel = {
    countDocuments: jest.fn().mockResolvedValue(3),
    find: jest.fn((obj) => mockQuery),
  };
  const mockReq = {
    filterObj: { x: "fdkjl" },
    query: {},
  };
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  const mockNext = jest.fn();
  const handler = getAll(mockModel);
  it("should return all items", async () => {
    await handler(mockReq, mockRes, mockNext);
    expect(mockModel.countDocuments).toHaveBeenCalled();

    expect(mockModel.find).toHaveBeenCalled();
    expect(mockModel.find).toHaveBeenCalledWith(mockReq.filterObj);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      results: 3,
      paginationInfo: { limit: 10, page: 1 },
      data: ["doc1", "doc2", "doc3"],
    });
  });
});
