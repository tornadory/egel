# Egel

## Engine design

### Inspiration
  - https://github.com/amelierosser/medium (in terms of engine structure)
  - https://github.com/pissang/qtek (in terms of capabilities and shaders)
  - https://github.com/KhronosGroup/glTF-WebGL-PBR (in terms of PBR shader)

### General statements
- Build around the WebGL rasterizer API
- Lean and mean build
- Bundle size should be significantly smaller than Three.js
- First and foremost a rendering engine, no physics or audio

### Scene
- Minimal scene graph should be included

### Materials
- Should include a material system (ubershader with chunks)
- Handle the creation, binding, unbinding and destruction of shaders
- Should follow the physically based metallic-roughness workflow by default

### Lighting
- Physically based lighting and materials
- Should include diffuse lighting, point lights, directional lights and area lights
- IBL using HDR 

## Loading
- Simple promise based file loader should be included
- Texture loader should extend this basic loader
- Model loading (Draco / glTF2)
- HDR images should be able to be loaded and parsed effectively

## Postprocessing
- Framebuffer for postprocessing effects (dof, bloom, tone mapping, etc)
