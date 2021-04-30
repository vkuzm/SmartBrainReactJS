const ClariFai = require("clarifai");

const app = new ClariFai.App({
  apiKey: process.env.CLARIFAI_API_KEY,
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

  db("entries")
    .where("user_id", "=", userId)
    .increment("counter", count)
    .returning("counter")
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
