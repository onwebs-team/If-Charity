const express = require("express");
const router = express.Router();
const Charity = require("../models/charity");
const Doner = require("../models/donor");
const axios = require("axios");

const getCharityInfo = async () => {
  try {
    return await axios.get(
      `https://api.data.charitynavigator.org/v2/Organizations?app_id=d54cad3f&app_key=202cc4e34ec2318a42feb48a2ffe8424`
    );
  } catch (e) {
    console.log(e);
  }
};

const orgenizeAPI = (data) => {
  const charities = [];
  for (let i = 50; i < 100; i++) {
    if (data[i].irsClassification) {
      let newCharity = {
        name: data[i].charityName,
        description: data[i].irsClassification.affiliation,
        website: data[i].charityNavigatorURL,
        classification: data[i].irsClassification.classification,
      };
      charities.push(newCharity);
    }
  }
  return charities;
};

router.get("/fetchCharities", async function (request, response) {
  try {
    let charityInfo = await getCharityInfo();
    const charities = orgenizeAPI(charityInfo.data);
    charities.forEach(async (charity) => {
      const newCharities = new Charity(charity);
      const savedCharities = await newCharities.save();
      console.log(savedCharities);
    });
    response.send(charities);
  } catch (e) {
    console.log(e);
  }
});

router.get("/getCharities", async (req, res) => {
  const charities = await Charity.find({});
  res.send(charities);
});

router.get("/getCharity/:Charity", function (req, response) {
  const charityToFind = req.params.Charity;
  Charity.findOne({ name: charityToFind }, function (err, res) {
    if (res) {
      response.send(res);
    } else {
      response.send("not found");
    }
  });
});
router.get("/charities/:classification", async function (request, response) {
  let classification = request.params.classification;
  let charities;
  console.log(classification)
  try {
    if(classification == "Choose Organization") {
      charities = await Charity.find({});
    } else {
      charities = await Charity.find({ classification: classification });
    }
  } catch(e) {
    console.log(e)
  }
  response.send(charities);
});
router.post("/donate", async (req, res) => {
  try {
    const donation = req.body;
    let doner = new Doner({ name: donation.name, amount: donation.amount });
    await doner.save();
    let charity = await Charity.findOne({ name: donation.nameOfcharity });
    charity.doners.push(doner);
    await charity.save();
    res.end();
  } catch(e) {
    console.log(e)
  }
});
router.get("/getCharityAmount/:Charity", function (req, response) {
  const charityToFind = req.params.Charity;
  Charity.findOne({ name: charityToFind })
    .populate("doners")
    .exec(function (err, res) {
      response.send(res);
    });
});
module.exports = router;
