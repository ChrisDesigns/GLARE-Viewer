import React, { useEffect } from 'react';
import { useLoader } from 'react-three-fiber';
import { TextureLoader } from 'three';
import { DeviceOrientationControls } from 'drei';

function handleVideo(video) {
  // Older browsers might not implement mediaDevices at all, so we set an empty object first
  if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
  } // Some browsers partially implement mediaDevices. We can't just assign an object
  // with getUserMedia as it would overwrite existing properties.
  // Here, we will just add the getUserMedia property if it's missing.


  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function (constraints) {
      // First get ahold of the legacy getUserMedia, if present
      var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia; // Some browsers just don't implement it - return a rejected promise with an error
      // to keep a consistent interface

      if (!getUserMedia) {
        return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
      } // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise


      return new Promise(function (resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    };
  } // this gets the camera 


  navigator.mediaDevices.getUserMedia({
    audio: false,
    video: process.env.NODE_ENV === 'production' ? {
      facingMode: {
        exact: "environment" // the front camera, if prefered

      }
    } : {}
  }).then(stream => {
    if (stream) {
      // Older browsers may not have srcObject
      if ("srcObject" in video.current) {
        video.current.srcObject = stream;
      } else {
        // Avoid using this in new browsers, as it is going away.
        video.current.src = window.URL.createObjectURL(stream);
      } // play the video stream


      video.current.onloadedmetadata = function (e) {
        video.current.play();
      };
    } else {
      console.warn("Missing auto stream");
    }
  }).catch(function (err) {
    console.warn(err);
  });
}

const SphereMapAR = /*#__PURE__*/React.memo(({
  data,
  video,
  tourBasePath
}) => {
  const {
    overlay
  } = data;
  const texture = useLoader(TextureLoader, tourBasePath + overlay);
  useEffect(() => {
    handleVideo(video);
  }, [video]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("group", {
    dispose: null
  }, /*#__PURE__*/React.createElement("mesh", null, overlay && /*#__PURE__*/React.createElement("sprite", {
    scale: [1 / 2, 1 / 2]
  }, /*#__PURE__*/React.createElement("spriteMaterial", {
    attach: "material",
    map: texture
  })))), /*#__PURE__*/React.createElement(DeviceOrientationControls, null));
});
export default SphereMapAR;