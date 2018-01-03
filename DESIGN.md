# Egel engine design

<<<<<<< HEAD
## Statement
Egel is a WebGL engine written in Typescript. It is not afraid to take learnings from other frameworks such as `medium` and `qtek`. The goal is to run a PBR rendering engine in real time on a large range of devices and modern browsers. The resulting build should be small, perform well and feature a set of minimal core features. Helpers and other visualizations that are helpful during the development process are to be split into their own packages. The goal is to provide a small framework that experiences can be build on top of. In the near future I would like to add a small range of debugging tools such as framebuffer visualization, render statistics (draw calls, memory usage) and a framecounter.

=======
>>>>>>> master
## Research
- https://gamedevelopment.tutsplus.com/articles/forward-rendering-vs-deferred-rendering--gamedev-12342
- https://github.com/KhronosGroup/glTF-WebGL-PBR
- http://marcinignac.com/blog/modular-webgl-with-pex/
- http://marcinignac.com/blog/pragmatic-pbr-intro/
- http://marcinignac.com/blog/pragmatic-pbr-setup-and-gamma
- http://marcinignac.com/blog/pragmatic-pbr-hdr/
- http://blog.selfshadow.com/publications/s2012-shading-course/#course_content
- http://blog.selfshadow.com/publications/s2015-shading-course/#course_content
- https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#appendix-b-brdf-implementation

## Papers
- [HDR Image-Based Lighting on the Web - Jeff Russel, Patrick Cozzi, WebGL Insights](https://webglinsights.github.io/downloads/WebGL-Insights-Chapter-16.pdf)
- [Moving Frostbite to Physically Based Rendering 3.0 paper - Sébastien Lagarde, Charles de Rousiers](https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf)
- [Moving Frostbite to Physically Based Rendering 3.0 presentation - Sébastien Lagarde, Charles de Rousiers](https://seblagarde.files.wordpress.com/2015/07/s2014_pbs_frostbite_slides.pdf)
- [Physically Based Shading At Disney - Brent Burley, Walt Disney Animation Studios](https://disney-animation.s3.amazonaws.com/library/s2012_pbs_disney_brdf_notes_v2.pdf)
- [Real Shading in Unreal Engine 4 - Brian Karis, Epic Games](https://cdn2.unrealengine.com/Resources/files/2013SiggraphPresentationsNotes-26915738.pdf)
- [Physically Based Shading At Disney - Gareth Morgan](https://www.youtube.com/watch?v=EspjgunLpoo)
- [An Inexpensive BRDF Model For Physically-based Rendering - Christophe Schlick](https://www.cs.virginia.edu/~jdl/bib/appearance/analytic%20models/schlick94b.pdf)
- [A Reflectance Model for Computer Graphics - Robert L. Cook, Kenneth E. Torrance](http://graphics.pixar.com/library/ReflectanceModel/paper.pdf)

## Implementations
- http://osgjs.org/examples/pbr/ (PBR implementation as used by Little Workshop's WebVR showroom experience)
- https://github.com/amelierosser/medium (in terms of engine structure)
- https://github.com/pissang/qtek (in terms of capabilities and shaders)
- https://github.com/KhronosGroup/glTF-WebGL-PBR (in terms of PBR shader)
- https://github.com/pex-gl/ (in terms of composibility)
- https://github.com/yiwenl/Alfrid/ (in terms of capabilities and several optimizations)
- https://github.com/frguthmann/VirtuaLightJS (in terms of capabilities)

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
