# Design

## Statement
Egel is a WebGL engine written in Typescript. My goal is to create a realtime PBR rendering engine that runs smooth on a large range of devices and modern browsers. The resulting build should be small, perform well and feature a set of minimal core features. Helpers and other visualizations that are helpful during the development process are to be split into their own packages. In the near future I would like to add a small range of debugging tools such as framebuffer visualization, render statistics (draw calls, memory usage) and a framecounter.

## Must
- Must result in an engine that is stable for personal use
- Must have a small resulting bundle size in comparison to Three.js
- Must handle the creation, binding, unbinding and destruction of shaders
- Must include a minimal scene graph
- Must be able to load JSON, .obj (OBJ), .gltf / .glb (glTF2) or .drc (Draco) using a provided file loader
- Must be able to parse JSON, .obj (OBJ), .gltf / .glb (glTF2) or .drc (Draco) using a provided file parser
- Must be able to load and apply textures to meshes
- Must be able to apply shaders to meshes as materials
- Must use a design of a single ubershader where chunks are composed into with hooks
- Must be able to compose shaders out of several chunks
- Must use PBR lighting and materials (metallic-roughness workflow) by default
- Must have point lights, directional lights and ambient light
- Must have support for Variance Shadow Mapping. Real time shadows should be smooth.
- Must have a clearly defined struture for creating meshes with materials
- Must support postprocessing using framebuffers in an effect composer
- Must include several postprocessing effects (bloom, FXAA, blur, DOF, SSAO)
- Must support image based lighting using HDR's
- Must have environment map generation support based on camera position (128 x 128)

## Should
- Should use a deferred rendering setup for multi-light support
- Should be written in a functional style where possible
- Should support light maps and interpolation of those lightmaps
- Should have several helper and performance tools in seperate packages (grid, axis, framebuffer visualizer, fps counter, performance metrics profiler (drawcalls, vertices))
- Should have spot lights with more advanced shadow casting properties
- Should use web workers where necessary to parse large files (such as radiance files for HDR)
- Should expose the internal render state from the renderer to tools in order to be able to track performance metrics
- Should have basic optimizations implemented such as frustum culling and occlusion culling
- Should include shader and matrix caching optimizations
- Should support a raypicker
- Should support screen-space reflections

## Could
- Could support loading and parsing compressed textures such as .dds
- Could support LOD (question is if it is more effecient on the web)
- Could use glslify to compose shaders
- Could have a minimal testing suite (canvas result diffing even though it is reported to be very inaccurate) based on `headless-gl`
- Could support fake SSS with mulitiple gaussian blurs and internal bounces
- Could have raytracing support (possibly for drawing with SDF's)
- Could have animation support through morph targets or bones
- Could have skinning support
- Could use a worker pool to do heavy tasks on different threads
- Could have a sequencer extension for animating camera's and positions (based on time travel Redux)
