# Egel

## Engine design

Inspiration:
- https://github.com/amelierosser/medium (in terms of engine structure)
- https://github.com/pissang/qtek (in terms of capabilities and shaders)
- https://github.com/KhronosGroup/glTF-WebGL-PBR (in terms of PBR shader)

- Build around the WebGL rasterizer API
- Lean and mean build
- Bundle size should be significantly smaller than Three.js
- First and foremost a rendering engine, no physics or audio

- Physically based lighting and materials
- Should include diffuse lighting, point lights, directional lights and area lights.
- Scene graph
- Material system
- Handle textures
- IBL using HDR
- File loading
- Framebuffer for postprocessing effects (dof, bloom, tone mapping, etc)
- Model loading (Draco / glTF2)
- Handle the creation, binding, unbinding and destruction of shaders
- Ubershader with smaller chunks
