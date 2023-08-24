const AWS = require('aws-sdk');
// const fs = require('fs');
const sharp = require('sharp');
const config = require('../config/secret');

// const app = express();
// const port = 3001;

// Configure AWS credentials
// AWS.config.update({ region: 'us-east-1' }); // Change to your desired region

const AWS_CONFIG = {
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
  region: 'us-east-1',
};

AWS.config.update(AWS_CONFIG); // Change to your desired region
// Create a new instance of the Rekognition service
const rekognition = new AWS.Rekognition();

const detectFace = async (params, img) => {
  try {
    const data = await rekognition.detectFaces(params).promise();

    const detectedFaces = data.FaceDetails;

    const checkAspectRatio = async (fc) => {
      const boundingBox = fc.BoundingBox;
      if (boundingBox) {
        const aspectRatio = boundingBox.Width / boundingBox.Height;
        // ... Further processing based on the aspect ratio ...

        // console.log(`the final, solution aspectRatio  ==> ${JSON.stringify(aspectRatio)}`);


        // Set an aspect ratio threshold
        const aspectRatioThreshold = 0.8; // Adjust as needed

        // Check if the aspect ratio indicates that the face is close to the camera
        if (aspectRatio >= aspectRatioThreshold) {
          // console.log('the face is close enough');
          //  res.json({ message: 'Valid portrait human face detected close to the camera.' });
          return true;
        }
        // console.log('the face is NOT close enough');

        return false;
        //  res.json({ message: 'Valid portrait human face detected but not close to the camera.' });
      }
      // console.log('BoundingBox data not available for detected face.');
      return false;
    };

    const getFaceOrientation = async (landmarks) => {
      // console.log(`I GOT HERE TTHE ORIENTATION${JSON.stringify(landmarks[1])}`);
      const leftEye = landmarks.find((landmrk) => landmrk.Type === 'eyeLeft');
      const rightEye = landmarks.find((landmrk) => landmrk.Type === 'eyeRight');

      if (!leftEye || !rightEye) {
        // console.log('unkown');
        return false; // Cannot determine orientation without both eyes
      }

      // Calculate the slope of the line connecting the eyes
      const deltaX = rightEye.X - leftEye.X;
      const deltaY = rightEye.Y - leftEye.Y;
      const slope = deltaY / deltaX;

      if (Math.abs(slope) <= 0.2) {
        // console.log('Horizontally');
        // return 'Horizontally Oriented';
        return true;
      }
      if (Math.abs(slope) >= 5) {
        // console.log('Vertically');
        return false;

        // return 'Vertically Oriented';
      }
      // console.log('UKNOWN');

      // return 'Unknown';
      return false;
    };

    if (detectedFaces && detectedFaces.length === 1) {
      const detectedFace = detectedFaces[0]; // Assuming you're working with a single detected face

      // check aspect ratio

      const asCheck = await checkAspectRatio(detectedFace);

      // check if image is vertical

      // Analyze the orientation of the detected face
      const orCheck = await getFaceOrientation(detectedFace.Landmarks);

      // console.log(`the final, solution  ==> ${JSON.stringify(asCheck)}`);
      // console.log(`the final, solution  ==> ${JSON.stringify(orCheck)}`);

      if (asCheck && orCheck) {
        // console.log(`the final, solution  ==> ${JSON.stringify(orCheck)}`);
        return true;
      }
      return false;

      // check colour of the background

      // checkBackground(detectedFace);
    }
    // console.log('No faces detected in the image.');
    return false;
  } catch (error) {
    // console.error('Error:', error);
    // res.status(500).json({ error: 'An error occurred' });
    // throw error;
    return false;
  }
};

module.exports = {
  detectFace,
};
