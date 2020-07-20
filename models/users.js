const { extractValidFields } = require("../lib/validation");
const mysqlPool = require("../lib/mysqlPool");
const bcrypt = require("bcryptjs");

const userSchema = {
	name: { required: true },
	email: { required: true },
	password: { required: true },
	role: { required: true },
	description: { required: false },
};
exports.userSchema = userSchema;

exports.createUser = async function (user) {
	const userToInsert = extractValidFields(user, userSchema);
	userToInsert.password = await bcrypt.hash(userToInsert.password, 6);
	const [results] = await mysqlPool.query(
		"INSERT INTO users SET ?",
		userToInsert
	);
	return results.insertId;
};

exports.getUserbyEmail = async function (email, includedPassword) {
	if (includedPassword) {
		const [results] = await mysqlPool.query(
			"SELECT * FROM users where email=?",
			[email]
		);
		return results[0];
	} else {
		const [
			results,
		] = await mysqlPool.query(
			"SELECT userID, name, email, description, role FROM users where email=?",
			[email]
		);
		return results[0];
	}
};

exports.validateUser = async function (email, password) {
	const user = await exports.getUserbyEmail(email, true);
	return user && (await bcrypt.compare(password, user.password));
};

exports.getUserbyId = async function (id, includedPassword) {
	if (includedPassword) {
		const [
			results,
		] = await mysqlPool.query("SELECT * FROM users where userID=?", [id]);
		return results[0];
	} else {
		const [
			results,
		] = await mysqlPool.query(
			"SELECT userID, name, email, description, role FROM users where userID=?",
			[id]
		);
		return results[0];
	}
};
exports.getInstructorbyID = async function (id, includedPassword) {
	if (includedPassword) {
		const [
			results,
		] = await mysqlPool.query(
			"SELECT * FROM courses a join users b on b.userID = a.instructorId where a.instructorId = ? and b.userID =? and b.role='instructor'",
			[id, id]
		);
		console.log(results);
		return results;
	} else {
		const [
			results,
		] = await mysqlPool.query(
			"SELECT courseID FROM courses JOIN users ON users.userID = courses.instructorId WHERE courses.instructorId = ? AND users.userID = ? AND users.role='instructor'",
			[id, id]
		);
		return results;
	}
};

exports.getStudentCoursebyID = async function (id, includedPassword) {
	const [
		results,
	] = await mysqlPool.query(
		"select courseID from usercourse where studentID = ?",
		[id]
	);
	return results;
};

exports.getAdminbyID = async function (id, includedPassword) {
	if (includedPassword) {
		const [
			results,
		] = await mysqlPool.query("SELECT * FROM users where userID = ?", [id, id]);
		console.log(results);
		return results;
	} else {
		const [
			results,
		] = await mysqlPool.query(
			"SELECT userID, name, email, description, role FROM users where userID = ?",
			[id, id]
		);
		return results;
	}
};
