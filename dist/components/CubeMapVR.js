import React from 'react';
import { useLoader } from 'react-three-fiber';
import { OrbitControls } from 'drei';
import { TextureLoader, FrontSide, Vector3 } from 'three';

const OverlayVR = ({
  data,
  tourBasePath
}) => {
  const {
    overlay_size = 10,
    overlay_offset_x = 0,
    overlay_offset_y = 0,
    overlay
  } = data;
  const texture = useLoader(TextureLoader, tourBasePath + overlay);
  return /*#__PURE__*/React.createElement("mesh", {
    position: [overlay_offset_x, overlay_offset_y, -9]
  }, /*#__PURE__*/React.createElement("planeGeometry", {
    attach: "geometry",
    args: [overlay_size, overlay_size]
  }), /*#__PURE__*/React.createElement("meshBasicMaterial", {
    attach: "material",
    map: texture,
    side: FrontSide
  }));
};

const CubeMap = ({
  panorama_image,
  tourBasePath
}) => {
  const texture = useLoader(TextureLoader, tourBasePath + panorama_image); // Begin shaders to add mipmaps, remove seams, and convert to cubemap

  const vertexShader = `
  varying vec3 worldPosition;
  void main () {
    vec4 p = vec4 (position, 1.0);
    worldPosition = (modelMatrix * p).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * p;
  }`;
  const fragmentShader = `
  uniform sampler2D map;
  uniform vec3 placement;
  varying vec3 worldPosition;
  const float seamWidth = 0.01;
  void main () {
    vec3 R = worldPosition - placement;
    float r = length (R);
    float c = -R.y / r;
    float theta = acos (c);
    float phi = atan (R.x, -R.z);
    float seam = 
      max (0.0, 1.0 - abs (R.x / r) / seamWidth) *
      clamp (1.0 + (R.z / r) / seamWidth, 0.0, 1.0);
    gl_FragColor = texture2D (map, vec2 (
      0.5 + phi / ${2 * Math.PI},
      theta / ${Math.PI}
    ), -2.0 * log2(1.0 + c * c) -12.3 * seam);
  }`;
  const uniforms = {
    map: {
      type: 't',
      value: texture
    },
    placement: {
      type: 'v3',
      value: new Vector3()
    }
  }; // end shader content

  return /*#__PURE__*/React.createElement("mesh", null, /*#__PURE__*/React.createElement("boxGeometry", {
    attach: "geometry",
    args: [20, 20, -20]
  }), /*#__PURE__*/React.createElement("shaderMaterial", {
    attach: "material",
    uniforms: uniforms,
    fragmentShader: fragmentShader,
    vertexShader: vertexShader
  }));
};

const CubeMapVR = /*#__PURE__*/React.memo(({
  data,
  tourBasePath
}) => {
  const {
    panorama_image,
    overlay
  } = data;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("group", {
    dispose: null
  }, panorama_image && /*#__PURE__*/React.createElement(CubeMap, {
    panorama_image: panorama_image,
    tourBasePath: tourBasePath
  }), overlay && /*#__PURE__*/React.createElement(OverlayVR, {
    data: data,
    tourBasePath: tourBasePath
  })), /*#__PURE__*/React.createElement(OrbitControls, {
    enablePan: false,
    enableDamping: true,
    minDistance: 1,
    maxDistance: 3
  }));
});
export default CubeMapVR;