const handleRegister = (db, bCrypt) => (req, res) => {
  const { email, name, password } = req.body;
  const hash = bCrypt.hashSync(password);

  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then(() => {
        return trx("users")
          .returning("*")
          .insert({
            name: name,
            email: email,
            joined: new Date(),
          })
          .then((user) => {
            res.status(201).json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((error) => {
    console.error(error);
    res.status(400).json("Unable to register new user");
  });
};

module.exports = {
  handleRegister,
};
