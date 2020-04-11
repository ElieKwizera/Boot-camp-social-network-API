const results = (model,populate) => async (req,res,next)=>
{
    let query;
    let parsedQuery;
    const reqQuery = {...req.query};
    const fieldsToRemove = ['select', 'sort', 'limit', 'page'];

    fieldsToRemove.forEach(param => delete reqQuery[param]);

    query = JSON.stringify(reqQuery).replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    parsedQuery = model.find(JSON.parse(query));

    if (req.query.select)
    {
        const fields = req.query.select.split(',').join(' ');
        parsedQuery = parsedQuery.select(fields);
    }
    if (req.query.sort)
    {
        const sortBy = req.query.sort.split(',').join(' ');
        parsedQuery = parsedQuery.sort(sortBy);
    }
    else
    {
        parsedQuery = parsedQuery.sort('-createdAt');
    }
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 3;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const pageTot = await model.countDocuments();

    parsedQuery = parsedQuery.skip(startIndex).limit(limit);

    if(populate)
    {
        parsedQuery = parsedQuery.populate(populate);
    }

    const results = await parsedQuery;

    const pagination = {};

    if (endIndex < pageTot)
    {
        pagination.next =
            {
                page: page + 1,
                limit
            }
    }

    if (startIndex > 0)
    {
        pagination.prev =
            {
                page: page - 1,
                limit
            }
    }

    res.advancedResults = {
        success: true,
        count: results.length,
        pagination,
        data: results
    }
    next();
};

module.exports = results;