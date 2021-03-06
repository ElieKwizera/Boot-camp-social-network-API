const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');

exports.getCourses = async (req, res, next) =>
{
    try
    {
        if (req.params.bootcampID)
        {
            const courses = await Course.find({bootcamp: req.params.bootcampID});
            return res.status(200).json(
                {
                    success: true,
                    count: courses.length,
                    data: courses
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

exports.getCourse = async (req, res, next) =>
{
    try
    {
        const id = req.params.id;
        const course = await Course.findById(id).populate(
            {
                path: 'bootcamp',
                select: 'name description'
            }
        );

        res.status(200).json({
            success: true,
            data: course
        });
    } catch (error)
    {
        next(error);
    }
};

exports.addCourse = async (req, res, next) =>
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
        const course = await Course.create(req.body);

        res.status(200).json(
            {
                success: true,
                data: course
            }
        );
    } catch (error)
    {
        next(error);
    }
};

exports.updateCourse = async (req, res, next) =>
{
    try
    {
        let course = await Course.findById(req.params.id);

        if (!course)
        {
            return res.status(404).json(
                {
                    success: false,
                    message: 'course not found'
                }
            );
        }

        if (Course.user.toString() !== req.user.id.toString() && req.user.role !== 'admin')
        {
            return  res.status(400).json({
                success: false,
                message: 'You can not update a course unless you are the publisher'
            });
        }
        course = await Course.findByIdAndUpdate(req.params.id, req.body,
            {
                new: true,
                runValidators: true
            });
        res.status(200).json({
            success: true,
            data: course
        });

    } catch (error)
    {
        next(error);
    }
};

exports.deleteCourse = async (req, res, next) =>
{
    try
    {
        let course = await Course.findById(req.params.id);

        if (!course)
        {
            return res.status(404).json(
                {
                    success: false,
                    message: 'course not found'
                }
            );
        }

        if (Course.user.toString() !== req.user.id.toString() && req.user.role !== 'admin')
        {
            return  res.status(400).json({
                success: false,
                message: 'You can not create a course unless you are the publisher'
            });
        }

        await Course.findByIdAndDelete(req.params.id);
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
