const { extractValidFields } = require("../lib/validation");
const mysqlPool = require("../lib/mysqlPool");
const { objectId,GridFSBucket } = require("mongodb");
const fs = require('fs');
const { getDBReference } = require('../lib/mongo')
const bcrypt = require("bcryptjs");

const assignmentSchema = {
	courseId: { required: true },
	description: { required: false },
	title: { required: true },
	points: { required: true },
	due: { required: true },
};

exports.assignmentSchema = assignmentSchema;

// create a new assignment
exports.createAssignment = async function (assignment) {
	const assignmentToInsert = extractValidFields(assignment, assignmentSchema);
	const [results] = await mysqlPool.query(
		"INSERT INTO assignments SET ?",
		assignmentToInsert
	);
	return results.insertId;
};

// fetch data about a specific assignment
exports.getAssignmentbyID = async function (id) {
	const [
		results,
	] = await mysqlPool.query(
		"SELECT * FROM assignments WHERE assignmentID = ?",
		[id]
	);
	return results[0];
};

// get the numbers of assignments
async function getAssignmentCount() {
	const [results, fields] = await mysqlPool.query(
		"SELECT COUNT(*) AS count FROM assignments"
	);
	return results[0].count;
}
// get assignment page
exports.getassignmentPage = async function (page, studentID, assignmentID) {
	const count = await getAssignmentCount();
	const pageSize = 10;
	const lastPage = Math.ceil(count / pageSize);
	page = page > lastPage ? lastPage : page;
	page = page < 1 ? 1 : page;
	const offset = (page - 1) * pageSize;

	const [
		results,
	] = await mysqlPool.query(
		"SELECT * FROM submissions WHERE assignmentID = ? AND studentId = ? LIMIT ?, ?",
		[assignmentID, studentID, offset, pageSize]
	);
	return {
		assignments: results,
		page: page,
		totalPages: lastPage,
		pageSize: pageSize,
		count: count,
	};
};
// update data for a specific assignment
exports.updateAssignment = async function (assignment, id) {
	const [
		results,
	] = await mysqlPool.query("UPDATE assignments SET ? WHERE assignmentID = ?", [
		assignment,
		id,
	]);
	return results.affectedRows > 0;
};

// remove a specific assignment from the database
exports.deleteAssignment = async function (id) {
	const [
		results,
	] = await mysqlPool.query("DELETE FROM assignments WHERE assignmentID = ?", [
		id,
	]);
	return results.affectedRows > 0;
};

// fetch the list of all submissions for an assignment
exports.getSubmitbyID = async function (id) {
	const [
		results,
	] = await mysqlPool.query(
		"SELECT * FROM submissions WHERE assignmentid = ?",
		[id]
	);
	return results;
};

// create a new submission for an assignment
exports.createSubmit = async function (submit) {
	submit.id = null;
	const [results] = await mysqlPool.query("INSERT INTO submissions SET ?", [
		submit,
	]);
	return results.insertId;
};

exports.getCoursebyID = async function (id) {
	const [
		results,
	] = await mysqlPool.query("SELECT * FROM courses WHERE courseID = ?", [id]);
	return results[0];
};

exports.getInstructorIDbyAssignmentID = async function (
	assignmentid,
	studentID
) {
	const [
		results,
	] = await mysqlPool.query(
		"select instructorId from courses join assignments on assignments.courseId = courses.courseID join submissions on assignments.assignmentID = submissions.assignmentID where assignments.assignmentID = ? && submissions.studentId = ?",
		[assignmentid, studentID]
	);
	console.log(results);
	return results[0];
};
