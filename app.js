import express from "express";
import { config } from "dotenv";

import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

config();

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 8000;

console.log("Bucket REgion", process.env.AWS_ACCESS_ID);

const awsS3Client = new S3Client({
  region: process.env.BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY_ID,
  },
});

app.get("/", (req, res) => {
  console.log("YOYO");
  return res.status(200).json({ message: "hello from docker" });
});

app.get("/get-image/:imgKey", async (req, res) => {
  const imgKey = req?.params?.imgKey;

  if (!imgKey)
    return res.status(400).json({ message: "Image Key is Required" });

  const getObjectCommand = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: imgKey,
  });

  const url = await getSignedUrl(awsS3Client, getObjectCommand, {
    expiresIn: 60,
  });

  return res.status(200).json({ url });
});

app.post("/post-image", async (req, res) => {
  console.log("req.body", req.body);
  const key = req.body?.key;
  if (!key) {
    return res.status(400).json({ message: "Image Key is Required" });
  }

  const putObjectCommand = new PutObjectCommand({
    Bucket: "sukh-test-bucket-yt",
    Key: key,
  });

  const url = await getSignedUrl(awsS3Client, putObjectCommand);
  return res.status(201).json({ url });
});

app.listen(PORT, () => {
  console.log(`app is listning on PROT ${PORT}`);
});
