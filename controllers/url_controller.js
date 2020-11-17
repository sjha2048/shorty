const validUrl = require("valid-url");
const models = require("../models");
const shortId = require("shortid");
const config = require("config");

async function shorten(req, res) {
  const longUrl = req.body.longUrl;
  const baseUrl = config.get("baseUrl");

  if (!validUrl.isUri(baseUrl)) {
    return res.status(401).json("invalid base url");
  }

  const urlCode = shortId.generate();

  if (validUrl.isUri(longUrl)) {
    try {
      let url = await models.Url.findOne({ where: { longUrl: longUrl } });

      if (url) {
        res.json(url);
      } else {
        const shortUrl = baseUrl + "/" + urlCode;

        const url = {
          longUrl: longUrl,
          shortUrl: shortUrl,
          urlCode: urlCode,
          date: new Date(),
        };

        models.Url.create(url).then((result) => {
          res
            .status(201)
            .json({
              message: "url stored sucessfully in the database",
              url: result,
            })
            .catch((error) => {
              res.status(500).json({
                message: "something went wrong",
                error: error,
              });
            });
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json("server error");
    }
  } else {
    res.status(401).json("invalid long url");
  }
}

async function redirect(req, res) {
  try {
    const code = req.params.code;
    const url = await models.Url.findOne({ where: { urlCode: code } });

    if (url) {
      return res.redirect(url.longUrl);
    } else {
      return res.status(404).json("url not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("server error");
  }
}

module.exports = {
  shorten: shorten,
  redirect: redirect,
};
