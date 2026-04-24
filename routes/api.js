import express from 'express';
const router = express.Router();
import { db } from '../models/index.ts';

const pageContent = {
    title: 'Vash Example',
    heading: 'Hello from Vash',
    message: 'This page is rendered by Express using the Vash view engine.'
};


router.get('/content', (req, res) => {
    res.render('content', pageContent);
});

router.get('/list', async (req, res) => {
    try {
        const heads = await db.Head.find().sort({ hid: 1 });
        const students = await db.Student.aggregate([
            {
                $lookup: {
                    from: "marks",
                    localField: "regno",
                    foreignField: "regno",
                    as: "all_marks"
                }
            },
            {
                $project: {
                    regno: 1,
                    name: 1,
                    all_marks: 1,
                    total_obtained: { $sum: "$all_marks.marks" }
                }
            },
            {
                $addFields: {
                    marks_map: {
                        $arrayToObject: {
                            $map: {
                                input: "$all_marks",
                                as: "m",
                                in: {
                                    k: { $concat: ["h", { $toString: "$$m.hid" }] },
                                    v: "$$m.marks"
                                }
                            }
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: "grades",
                    let: { total: "$total_obtained" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $gte: [{ $round: ["$$total", 0] }, "$start"] },
                                        { $lte: [{ $round: ["$$total", 0] }, "$end"] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "grade_info"
                }
            },
            {
                $unwind: {
                    path: "$grade_info",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    regno: 1,
                    name: 1,
                    total: "$total_obtained",
                    grade: "$grade_info.grade",
                    gpa: "$grade_info.gpa",
                    marks_map: 1
                }
            }
        ]);
        res.render('list', { students, heads });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/student-marks/:regno', async (req, res) => {
    try {
        const marks = await db.Mark.aggregate([
            { $match: { regno: req.params.regno } },
            {
                $lookup: {
                    from: "heads",
                    localField: "hid",
                    foreignField: "hid",
                    as: "head_info"
                }
            },
            { $unwind: "$head_info" }
        ]);
        res.json({ marks });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/update-marks', async (req, res) => {
    try {
        const { regno, updates } = req.body;
        
        for (const update of updates) {
            await db.Mark.updateOne(
                { regno, mid: update.mid },
                { $set: { marks: update.marks } }
            );
        }
        
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;