const handleProfileGet = (db) => (req, res) => {
  const userId = Number(req.params.id);

  db("users")
    .select("*")
    .where("id", userId)
    .first()
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.status(400).json("User not found");
      }
    })
    .catch(() => {
      res.status(400).json("Unable to get user profile");
    });
};

const handleProfileUpdate = (db, bCrypt) => (req, res) => {
  const userId = Number(req.params.id);
  const { name, password, email, age, pet } = req.body.formInput;

  db("users")
    .where("id", "=", userId)
    .update({
      name: name,
      age: age,
      pet: pet,
    })
    .then((userData) => {
      if (userData > 0) {
        if (password && password.length >= 3) {
          db("login")
            .where("email", "=", email)
            .update({
              hash: bCrypt.hashSync(password),
            })
            .then((userLogin) => {
              if (userLogin > 0) {
                res.json("success");
              }
            });
        } else {
          res.json("success");
        }

      } else {
        res.status(400).json("Unable to update");
      }
    })
    .catch(() => res.status(400).json("Error while updating user"));
};

module.exports = {
  handleProfileGet,
  handleProfileUpdate,
};
