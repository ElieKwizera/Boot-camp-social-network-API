const Review = require('../models/Review');
const Bootcamp = require('../models/Bootcamp');

exports.getReviews = async (req, res, next) =>
{
    try
    {
        if (req.params.bootcampID)
        {
            const reviews = await Review.find({bootcamp: req.params.bootcampID});
            return res.status(200).json(
                {
                    success: true,
                    count: reviews.length,
                    data: reviews
                }
            );
        }
        else
        {
            res.status(200).json(res.advancedResults);
        }
    } catch (error)
    {
        console.log(error)
    }

};

exports.getReview = async (req, res, next) =>
{
    try
    {
        const id = req.params.id;
        const review = await Review.findById(id).populate(
            {
                path: 'bootcamp',
                select: 'name description'
            }
        );

        res.status(200).json({
            success: true,
            data: review
        });
    } catch (error)
    {
        next(error);
    }
};

exports.addReview = async (req, res, next) =>
{
    try
    {
        req.body.bootcamp = req.params.bootcampID;
        req.body.user = req.user.id;
        const bootcamp = Bootcamp.findById(req.params.bootcampID);

        if (bootcamp.user.toString() !== req.user.id.toString() && req.user.role !== 'admin')
        {
            return  res.status(400).json({
                success: false,
                message: 'You can not create a course unless you are the publisher'
            });
        }
        const review = await Review.create(req.body);

        res.status(200).json(
            {
                success: true,
                data: review
            }
        );
    } catch (error)
    {
        next(error);
    }
};

exports.updateReview = async (req, res, next) =>
{
    try
    {
        let review = await Review.findById(req.params.id);

        if (!review)
        {
            return res.status(404).json(
                {
                    success: false,
                    message: 'Review not found'
                }
            );
        }

        if (Review.user.toString() !== req.user.id.toString() && req.user.role !== 'admin')
        {
            return  res.status(400).json({
                success: false,
                message: 'You can not update a review unless you are the publisher'
            });
        }
        review = await Review.findByIdAndUpdate(req.params.id, req.body,
            {
                new: true,
                runValidators: true
            });
        res.status(200).json({
            success: true,
            data: review
        });

    } catch (error)
    {
        next(error);
    }
};

exports.deleteReview = async (req, res, next) =>
{
    try
    {
        let review = await Review.findById(req.params.id);

        if (!review)
        {
            return res.status(404).json(
                {
                    success: false,
                    message: 'review not found'
                }
            );
        }

        if (Review.user.toString() !== req.user.id.toString() && req.user.role !== 'admin')
        {
            return  res.status(400).json({
                success: false,
                message: 'You can not delete a review unless you are the publisher'
            });
        }

        await Review.findByIdAndDelete(req.params.id);
        res.status(200).json(
            {
                sucess: true,
                message: 'course deleted'
            }
        );
    } catch (error)
    {
        next(error);
    }

};
