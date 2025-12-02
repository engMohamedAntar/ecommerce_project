//ApiFeatures.js
class ApiFeatures {
  constructor(mongooseQuery, queryObj) {
    this.mongooseQuery = mongooseQuery;
    this.queryObj = queryObj;
  }

  filter() {
    let queryObj = { ...this.queryObj };
    const execluded_queries = ["sort", "page", "limit", "fields", "keyword"];
    execluded_queries.forEach((q) => delete queryObj[q]); //execlude unneeded queries from queryObj

    let filterString = JSON.stringify(queryObj);
    filterString = filterString.replace(
      /\b(gte|gt|lt|lte)\b/g,
      (match) => `$${match}`
    );
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(filterString));

    return this;
  }

  sort() {
    if (this.queryObj.sort) {
      const sortBy = this.queryObj.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  fieldFilter() {
    if (this.queryObj.fields) {
      const filterFields = this.queryObj.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(filterFields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  search(modelName) {
    if (this.queryObj.keyword) {
      const searchObj = {};
      if (modelName === "Product") {
        searchObj.$or = [
          { name: { $regex: this.queryObj.keyword, $options: "i" } },
          { description: { $regex: this.queryObj.keyword, $options: "i" } },
        ];
      } else {
        searchObj.$or = [
          { name: { $regex: this.queryObj.keyword, $options: "i" } },
        ];
      }

      this.mongooseQuery = this.mongooseQuery.find(searchObj);
    }
    return this;
  }

  paginate(countdocs) {
    const page = parseInt(this.queryObj.page) || 1;
    const limit = parseInt(this.queryObj.limit) || 50;
    const skip = (page - 1) * limit;
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

    //pagination info
    const paginationInfo = {};
    //numOfPages 
    paginationInfo.numOfPages = Math.ceil(countdocs / limit);
    //page
    paginationInfo.page = page;
    //prev
    if (page > 1) paginationInfo.previous = page - 1;
    //next
    const lastIdx = page * limit;
    if (lastIdx < countdocs) paginationInfo.next = page + 1;
    this.paginationInfo = paginationInfo;
    return this;
  }
}

module.exports = ApiFeatures;
