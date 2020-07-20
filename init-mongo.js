import { db } from "mongodb";

db.createUser({
	user: "flazzing",
	pwd: "hunter2",
	roles: [{ role: "readWrite", db: "tarpaulin-mongo" }],
});
