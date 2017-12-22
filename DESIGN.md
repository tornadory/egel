# Egel engine design

### Inspiration
  - https://github.com/amelierosser/medium (in terms of engine structure)
  - https://github.com/pissang/qtek (in terms of capabilities and shaders)
  - https://github.com/KhronosGroup/glTF-WebGL-PBR (in terms of PBR shader)

## Must
- Must have a small resulting bundle size in comparison to Three.js
- Must handle the creation, binding, unbinding and destruction of shaders
- Must include a minimal scene graph
- Must be able to load .obj (OBJ), .gltf / .glb (glTF2) or .drc (Draco) using a provided file loader
- Must be able to load and apply textures
- Must be able to compose shaders out of chunks
- Must function as a solid engine, state shouldn't get lost
- Must use PBR lighting and materials (metallic-roughness workflow) by default
- Must have point lights, directional lights and ambient light
- Must have support for Variance Shadow Mapping or PCF or raytraced shadows. Shadows should be smooth.
- Must have a clearly defined struture for creating meshes with materials
- Must support postprocessing using framebuffers in an effect composer
- Must include several postprocessing effects (bloom, FXAA, blur, DOF, SSAO)

## Should
- Should expose a few useful uniforms (like the transformation matrices)
- Should use web workers where necessary
- Should expose the internal render state to tools in order to be able to track performance metrics
- Should have several helper and performance tools in seperate packages (grid, axis, framebuffer visualizer, fps counter, performance metrics (drawcalls, vertices))
- Should use a design of a single ubershader where chunks are composed into with hooks
- Should have basic optimizations implemented such as frustum culling and occlusion culling
- Should support a raypicker
- Should support screen-space reflections
- Should have environment map generation based on camera position (128 x 128)
- Should have support for image based lighting using HDR's

## Could
- Could use glslify to compose shaders
- Could have a minimal testing suite (canvas result diffing even though it is reported to be very inaccurate)
- Could support fake SSS with gaussian blur
- Could have raytracing support (possibly for drawing with SDF's)
- Could have animation support through morph targets or bones
- Could use a worker pool to do heavy tasks on different threads
- Could have a sequencer for animating camera's and positions (based on time travel Redux)
- Could look into blending light map states based on time of day mechanic
