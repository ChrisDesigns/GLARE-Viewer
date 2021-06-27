# GLARE-Viewer
The VR and AR viewer component for GLARE

### Simple Usage
```javascript
{servingAR  &&  (<video  ref={videoRef}  autoPlay={true}  muted  playsInline />)}

<Canvas>
	<Suspense fallback={<Fallback />}>
		{servingAR ?
			<SphereMapAR data={DataAR} video={videoRef} /> :
			<CubeMapVR data={DataVR} />
		}
	</Suspense>
</Canvas>
```

# API Overview
## CubeMapVR
### Children props
 - **data** (*required*)
	 - **panorama_image** - relative path to panorama image that serves as the cube map for virtual space
	 - **overlay** - relative path to the overlay image that will appear over the virtual space 
	 - **overlay_size** - the scaled size of the overlay image from 0 to 10
	 - **overlay_offset_x** - the offset from the overlay relative to the front cube face's x-axis
	 - **overlay_offset_y** - the offset from the overlay relative to the front cube face's y-axis
	 - **virtual_object** - relative path to the GL Transmission Format (glTF) binary format (GLB) to appear in virtual space
 - **tourBasePath** - the basename path that will needs to be added in order for path files to be relative to the server's directory
## SphereMapAR
### Children props
 - **video**  (*required*) - the useRef to a video HTML element that will be used as a reference for the world camera's media stream.
 - **data** (*required*)
	 - **overlay** - relative path to the overlay image that will appear over the virtual space 
	 - **virtual_object** - relative path to the GL Transmission Format (glTF) binary format (GLB) to appear in virtual space
 - **tourBasePath** - the basename path that will needs to be added in order for path files to be relative to the server's directory
