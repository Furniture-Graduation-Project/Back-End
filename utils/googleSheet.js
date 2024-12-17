import { google } from "googleapis";
import path from "path";
import fs from "fs";

const keyPath = path.join(process.cwd(), "credentials.json");
const keys = JSON.parse(fs.readFileSync(keyPath));

const auth = new google.auth.JWT(
  keys.client_email,
  null,
  keys.private_key,
  ["https://www.googleapis.com/auth/spreadsheets"],
  null
);

const sheets = google.sheets({ version: "v4", auth });

export default sheets;
