const jwt = require("jsonwebtoken");
const redisService = require("../services/redis");

const redisClient = redisService.redisClient();

const signInAuthentication = (db, bCrypt) => (req, res) => {
  const { authorization } = req.headers;
  const loginData = req.body;

  if (authorization) {
    getAuthTokenId(authorization)
      .then((response) => res.json(response))
      .catch(() => res.status(400).json("Unauthorized"));
  } else {
    handleSignIn(loginData, db, bCrypt)
      .then((user) => {
        if (user && user.id && user.email) {
          return createSession(user);
        } else {
          return Promise.reject("Unable to sign in");
        }
      })
      .then((session) => res.json(session))
      .catch((error) => res.status(400).json(error));
  }
};

const getAuthTokenId = (authorization) => {
  return new Promise((resolve, reject) => {
    redisClient.get(authorization, (error, reply) => {
      if (error || !reply) {
        reject("error");
      } else {
        resolve({ id: reply });
      }
    });
  });
};

const handleSignIn = (loginData, db, bCrypt) => {
  const { email, password } = loginData;

  if (!email || !password) {
    return Promise.reject("Incorrect form submission");
  }

  return db
    .select("hash")
    .from("login")
    .where("email", "=", email)
    .first()
    .then((data) => {
      if (data) {
        const isValid = bCrypt.compareSync(password, data.hash);

        if (isValid) {
          return db
            .select("*")
            .from("users")
            .where("email", "=", email)
            .first()
            .catch(() => {
              return Promise.reject("Unable to get user");
            });
        }
      }
      return Promise.reject("Email or password is invalid");
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const createSession = (user) => {
  const { id, email } = user;
  const token = signToken(email);

  return saveToken(token, id)
    .then(() => {
      return { success: "true", userId: id, token: token };
    })
    .catch(console.log);
};

const signToken = (email) => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, "JWT_SECRET", { expiresIn: "2 days" });
};

const saveToken = (token, id) => {
  return Promise.resolve(redisClient.set(token, id));
};

module.exports = {
  signInAuthentication,
};
