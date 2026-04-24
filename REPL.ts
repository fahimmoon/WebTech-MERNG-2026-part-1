import { db } from "./models/index.ts";


// db.Student.find().then(students => {
//     students.forEach(async student => {
//         let result = await db.Mark.updateMany(
//             {regno: student.regno},
//             {$set : {student: student._id}}
//         );
//         console.log(result);
//     });
// })

db.Student.find()
    .then(marks => console.log(JSON.stringify(marks, null, 4)));

// db.Mark.find({ regno: "1712218" })
//   .select({ _id: 1 })
//   .then((marks) => console.log(JSON.stringify(marks, null, 4)));

// db.Student.find().then((students) => {
//   students.forEach(async (student) => {
//     let ids = await db.Mark.find({ regno: student.regno }).select({ _id: 1 });
//     let result = await db.Student.updateOne(
//       { regno: student.regno },
//       { $push: { marks: ids } },
//     );
//     console.log(result);
//   });
//   console.log(JSON.stringify(students, null, 4));
// });


// db.Student.find()
//   .populate('marks')
//   .then((students) => console.log(JSON.stringify(students, null, 4)));

// db.Student.aggregate([
//     {
//         $lookup: {
//             from: "marks", // collection name in MongoDB
//             localField: "regno", // field in Student
//             foreignField: "regno", // field in Mark
//             as: "obtain" // output array field
//         }
//     },
//     {
//         $unwind: "$obtain" // unwind the obtain array to get individual mark documents
//     }, 
//     {
//         $group:{
//             _id:{ regno: "$regno", name: "$name" },
//             total: { $sum: "$obtain.marks" }
//         }
//     }, 
//     {
//         $project: {
//             _id: 0,
//             regno: "$_id.regno",
//             name: "$_id.name",
//             total: 1
//         }
//     } 
// ])
// .then((res) => console.log(JSON.stringify(res, null, 4)))
// .then(() => process.exit(0));



// db.Mark.aggregate([
//     {
//         $lookup: { from: "students",  localField: "regno",  foreignField: "regno",  as: "student", 
//             pipeline: [{$project: { _id: 0, name: 1 }}]
//         }
//     }
// ])
// .then((res) => console.log(JSON.stringify(res, null, 4)))
// .then(() => process.exit(0));

// db.Student.aggregate([
//     {
//         $lookup: { from: "marks",  localField: "regno",  foreignField: "regno",  
//         pipeline: [{$lookup: { from: "heads",  localField: "hid",  foreignField: "hid",  as: "head"} }, {$unwind: "$head"}],    
//         as: "marks", 
//         }
//     }
// ])
// .then((res) => console.log(JSON.stringify(res, null, 4)))
// .then(() => process.exit(0));

