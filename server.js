const express = require("express");
const morgan = require("morgan");
const redis = require("redis");

const api = require("./api");

const app = express();
const port = process.env.PORT || 8000;

const redisHost = process.env.REDIS_HOST || "192.168.99.100";
const redisPort = process.env.Redis_PORT || "6379";

const redisClient = redis.createClient(redisPort, {
	host: redisHost,
	no_ready_check: true,
	auth_pass: "po123",
});

const rateLimitWindowMS = 60000;
const rateLimitNumRequests = 5;

function getUserTokenBucket(ip) {
	return new Promise((resolve, reject) => {
		redisClient.hgetall(ip, (err, tokenBucket) => {
			if (err) {
				reject(err);
			} else {
				if (tokenBucket) {
					tokenBucket.tokens = parseFloat(tokenBucket.tokens);
				} else {
					tokenBucket = {
						tokens: rateLimitNumRequests,
						last: Date.now(),
					};
				}
				resolve(tokenBucket);
			}
		});
	});
}

function saveUserTokenBucket(ip, tokenBucket) {
	return new Promise((resolve, reject) => {
		redisClient.hmset(ip, tokenBucket, (err, resp) => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}

async function applyRateLimit(req, res, next) {
	try {
		const tokenBucket = await getUserTokenBucket(req.ip);
		const timestamp = Date.now();
		const ellapsedMilliseconds = timestamp - tokenBucket.last;
		const newTokens =
			ellapsedMilliseconds * (rateLimitNumRequests / rateLimitWindowMS);
		tokenBucket.tokens += newTokens;
		tokenBucket.tokens = Math.min(tokenBucket.tokens, rateLimitNumRequests);
		tokenBucket.last = timestamp;

		if (tokenBucket.tokens >= 1) {
			tokenBucket.tokens -= 1;
			await saveUserTokenBucket(req.ip, tokenBucket);
			next();
		} else {
			await saveUserTokenBucket(req.ip, tokenBucket);
			res.status(429).send({
				error: "Too many requests per minute",
			});
		}
	} catch (err) {
		console.error(err);
		next();
	}
}

app.use(applyRateLimit);

/*
 * Morgan is a popular logger.
 */
app.use(morgan("dev"));
const { connectToDB } = require("./lib/mongo");
app.use(express.json());
app.use(express.static("public"));

/*
 * All routes for the API are written in modules in the api/ directory.  The
 * top-level router lives in api/index.js.  That's what we include here, and
 * it provides all of the routes.
 */
app.use("/", api);

app.use("*", function (req, res, next) {
	res.status(404).json({
		error: "Requested resource " + req.originalUrl + " does not exist",
	});
});

connectToDB(async () => {
	app.listen(port, () => {
		console.log("== Server is running on port", port);
	});
});
