const mysqlPool = require("../lib/mysqlPool");
const bcrypt = require("bcryptjs");

const { extractValidFields } = require("../lib/validation");

const fs = require("fs");
const { ObjectId, GridFSBucket } = require("mongodb");
const { getDBReference } = require("../lib/mongo");

const { getUserById } = require("./users");

const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const CourseSchema = {
	courseID: { require: true },
	subject: { require: true },
	number: { require: true },
	title: { require: true },
	term: { require: true },
	instructorId: { require: true },
};
exports.CourseSchema = CourseSchema;

async function getCourseCount() {
	const [results] = await mysqlPool.query(
		"SELECT COUNT(*) AS count FROM courses"
	);
	return results[0].count;
}

exports.getCoursesPage = async function (page) {
	const count = await getCourseCount();
	const pageSize = 10;
	const lastPage = Math.ceil(count / pageSize);
	page = page > lastPage ? lastPage : page;
	page = page < 1 ? 1 : page;
	const offset = (page - 1) * pageSize;
	const [results] = await mysqlPool.query("SELECT * FROM courses", [
		offset,
		pageSize,
	]);

	return {
		courses: results,
		page: page,
		totalPages: lastPage,
		pageSize: pageSize,
		count: count,
	};
};

//create new course
exports.CreateNewCourse = async function (course) {
	course = extractValidFields(course, CourseSchema);
	const [result] = await mysqlPool.query("INSERT INTO courses SET ?", course);

	return result.insertId;
};

// fetch data for a specific course
exports.getCourseById = async function (courseID) {
	const [
		results,
	] = await mysqlPool.query("SELECT * FROM courses WHERE courseID = ?", [
		courseID,
	]);

	return results[0];
};

getCourseById = async function (courseID) {
	const [
		results,
	] = await mysqlPool.query("SELECT * FROM courses WHERE courseID = ?", [
		courseID,
	]);

	return results[0];
};

// update data for a specific course
exports.updateCourse = async function (courseID, course) {
	course = extractValidFields(course, CourseSchema);
	const [
		result,
	] = await mysqlPool.query("UPDATE courses SET ? WHERE courseID = ?", [
		course,
		courseID,
	]);
	return result.affectedRows > 0;
};

// delete courses by id
exports.deleteCourse = async function (courseID) {
	const [
		result,
	] = await mysqlPool.query("DELETE FROM courses WHERE courseID = ?", [
		courseID,
	]);

	return result.affectedRows > 0;
};

// get student list by id?
// select * from usercourse join users on users.userId = usercourse.stuidentid where users.role = "student" and usercourse.courseId = 2
exports.getStudentById = async function (id) {
	const [
		result,
	] = await mysqlPool.query(
		"SELECT * FROM usercourse join users on users.userID = usercourse.studentID where users.role='student'and usercourse.courseID = ?",
		[id]
	);

	return result;
};

async function saveCSVFile(csv, courseID) {
	return new Promise((resolve, reject) => {
		const db = getDBReference();
		const bucket = new GridFSBucket(db, {
			bucketName: "csv",
		});
		const metadata = {
			courseID: courseID,
		};

		const uploadStream = bucket.openUploadStream(csv.filename, {
			metadata: metadata,
		});
		fs.createReadStream()
			.pipe(uploadStream)
			.on("error", (err) => {
				reject(err);
			})
			.on("finish", (result) => {
				resolve(result._id);
			});
	});
}
exports.saveCSVFile = saveCSVFile;

exports.getCSVDownloadStreamById = function (id) {
	const db = getDBReference();
	const bucket = new GridFSBucket(db, {
		bucketName: "csv",
	});
	return bucket.openDownloadStream(id);
};

exports.enrollStudentbyID = async function (userCourse) {
	const [results] = await mysqlPool.query(
		"INSERT INTO usercourse SET ?",
		userCourse
	);
	return results.insertId;
};

exports.unenrollStudentbyID = async function (student) {
	const [results] = await mysqlPool.query(
		"DELETE FROM usercourse WHERE studentID= ?",
		student
	);
	return results.insertId;
};

exports.getAssignmentIDByCourseID = async function (courseID) {
	const [
		result,
	] = await mysqlPool.query(
		"select assignments.assignmentID from assignments join courses on courses.courseID = assignments.courseId where courses.courseID = ?",
		[courseID]
	);

	return result;
};

exports.getStudentsByCourseID = async function (courseID) {
	const [
		result,
	] = await mysqlPool.query(
		"select studentID, email from usercourse join users on usercourse.studentID = users.userID where usercourse.courseID = ?",
		[courseID]
	);

	return result;
};
