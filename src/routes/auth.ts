import { Router } from "express";
import SpotifyWebApi from "spotify-web-api-node";
import { config } from "dotenv";
export const router = Router();
config();
const credentials = {
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI,
};

router.post("/login", async (req, res) => {
  try {
    console.log(credentials);
    let spotifyApi = new SpotifyWebApi(credentials);
    const code = req.body.code;
    console.log(code);
    const resp = await spotifyApi.authorizationCodeGrant(code);

    return res.status(200).json({ token: resp.body.access_token });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Bad Request" });
  }
});
