const ClariFai = require("clarifai");

const app = new ClariFai.App({
  apiKey: "d012da56ea7e409b9fbdbf0c775d5b0d",
});

const handleApiCall = () => (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then((data) => {
      res.json(data);
    })
    .catch(() => res.status(400).json("unable to work with API"));
};

const handleImage = (db) => (req, res) => {
  const userId = Number(req.body.id);
  const count = Number(req.body.count);

  db("users")
    .where("id", "=", userId)
    .increment("entries", count)
    .returning("entries")
    .then((entries) => {
      res.json(entries);
    })
    .catch(() => {
      res.status(400).json("Unable to increase a counter of entries");
    });
};

module.exports = {
  handleImage,
  handleApiCall,
};
