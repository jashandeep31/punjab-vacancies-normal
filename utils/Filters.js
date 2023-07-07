class FilterFeature {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    createdAt() {
        this.query = this.query.sort("-createdAt");
        return this;
    }

    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports = FilterFeature;
