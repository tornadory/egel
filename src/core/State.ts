// Vendor
import GLState from 'nanogl-state';

// Core
import * as Context from './Context';

// Blend
// -----
// Function: enableBlend() - Activates blending of the computed fragment color values.
// Type: [boolean] - gl.BLEND
// Parameters: ()
// Default: [false]

// Function: blendEquation()
// Type: [GLenum mode]
// Parameters: (GLenum FUNC_ADD, GLenum FUNC_SUBTRACT, GLenum FUNC_REVERSE_SUBTRACT)
// Default: [FUNC_ADD]

// Function: blendFunc()
// Type: [GLenum sfactor, GLenum dfactor] (source, distination)
// Parameters: (GLenum ZERO, GLenum ONE, GLenum SRC_COLOR, GLenum ONE_MINUS_SRC_COLOR, GLenum DST_COLOR, GLenum ONE_MINUS_DST_COLOR, GLenum SRC_ALPHA, GLenum ONE_MINUS_SRC_ALPHA, GLenum DST_ALPHA, GLenum ONE_MINUS_DST_ALPHA, GLenum SRC_ALPHA_SATURATE, GLenum CONSTANT_COLOR, GLenum ONE_MINUS_CONSTANT_COLOR, GLenum CONSTANT_ALPHA, GLenum ONE_MINUS_CONSTANT_ALPHA, GLenum SRC_ALPHA_SATURATE)
// Default: [ONE, ZERO]

// Function: blendEquationSeparate()
// Type: [GLenum modeRGB, GLenum modeAlpha]
// Parameters: (GLenum FUNC_ADD, GLenum FUNC_SUBTRACT, GLenum FUNC_REVERSE_SUBTRACT)
// Default: [FUNC_ADD]

// Function: blendFuncSeparate()
// Type: [GLenum srcRGB, GLenum dstRGB, GLenum srcAlpha, GLenum dstAlpha]
// Parameters: (GLenum ZERO, GLenum ONE, GLenum SRC_COLOR, GLenum ONE_MINUS_SRC_COLOR, GLenum DST_COLOR, GLenum ONE_MINUS_DST_COLOR, GLenum SRC_ALPHA, GLenum ONE_MINUS_SRC_ALPHA, GLenum DST_ALPHA, GLenum ONE_MINUS_DST_ALPHA, GLenum SRC_ALPHA_SATURATE, GLenum CONSTANT_COLOR, GLenum ONE_MINUS_CONSTANT_COLOR, GLenum CONSTANT_ALPHA, GLenum ONE_MINUS_CONSTANT_ALPHA, GLenum SRC_ALPHA_SATURATE)
// Default: [ZERO, ZERO, ZERO, ZERO]


// Depth
// -----
// Function: enableDepthTest() - Activates depth comparisons and updates to the depth buffer.
// Type: [boolean] - gl.DEPTH_TEST
// Parameters: ()
// Default: [false]

// Function: depthFunc()
// Type: [GLenum func]
// Parameters: (GLenum NEVER, GLenum LESS, GLenum EQUAL, GLenum LEQUAL, GLenum GREATER, GLenum NOTEQUAL, GLenum GEQUAL, GLenum ALWAYS)
// Default: [LESS]


// Cull face
// ---------
// Function: enableCullface() - Activates culling of polygons.
// Type: [boolean] - gl.CULL_FACE
// Parameters: ()
// Default: [false]

// Function: cullFace()
// Type: [GLenum mode]
// Parameters: (FRONT, BACK, FRONT_AND_BACK)
// Default: [BACK]

// Function: frontFace()
// Type: [GLenum mode]
// Parameters: (GLenum CW, GLenum CWW)
// Default: [CCW]


// Dither
// ------
// Function: enableDither() - Activates dithering of color components before they get written to the color buffer.
// Type: [boolean] - gl.DITHER
// Parameters: ()
// Default: [true]


// Polygon offset
// --------------
// Function: enablePolygonOffset() - Activates adding an offset to depth values of polygon's fragments.
// Type: [boolean] - gl.POLYGON_OFFSET_FILL
// Parameters: ()
// Default: [false]

// Function: polygonOffset()
// Type: [GLfloat factor, GLfloat units]
// Parameters: ()
// Default: [0, 0]


// Stencil
// -------
// Function: enableStencil() - Activates stencil testing and updates to the stencil buffer.
// Type: [boolean] - gl.STENCIL_TEST
// Parameters: ()
// Default: [false]

// Function: stencilFunc()
// Type: [GLenum func, GLint ref, GLuint mask]
// Parameters: (GLenum NEVER, GLenum LESS, GLenum EQUAL, GLenum LEQUAL, GLenum GREATER, GLenum NOTEQUAL, GLenum GEQUAL, GLenum ALWAYS)
// Default: [ALWAYS, 0x0, 0xFFFF]

// Function: stencilFuncSeparate()
// Type: [GLenum face, GLenum func, GLint ref, GLuint mask]
// Parameters: (GLenum NEVER, GLenum LESS, GLenum EQUAL, GLenum LEQUAL, GLenum GREATER, GLenum NOTEQUAL, GLenum GEQUAL, GLenum ALWAYS)
// Default: [0, 0, 0, 0]

// Function: stencilMask()
// Type: [GLuint mask]
// Parameters: ()
// Default: [FFFFFFFF]

// Function: stencilMaskSeparate()
// Type: [GLenum face, GLuint mask]
// Parameters: (GLenum FRONT, GLenum BACK, GLenum FRONT_AND_BACK)
// Default: [FRONT, FFFFFFFF]

// Function: stencilOp()
// Type: [GLenum fail, GLenum fail, GLenum zpass]
// Parameters: (GLenum ZERO, GLenum KEEP, GLenum REPLACE, GLenum INCR, GLenum DECR, GLenum INVERT, GLenum INCR_WRAP, GLenum DECR_WRAP)
// Default: [KEEP, KEEP, KEEP]

// Function: stencilOpSeparate()
// Type: [GLenum face, GLenum fail, GLenum zfail, GLenum zpass]
// Parameters: (GLenum ZERO, GLenum KEEP, GLenum REPLACE, GLenum INCR, GLenum DECR, GLenum INVERT, GLenum INCR_WRAP, GLenum DECR_WRAP)
// Default: [FRONT, KEEP, KEEP, KEEP]


// Scissor
// -------
// Function: enableScissor() - Activates the scissor test that discards fragments that are outside of the scissor rectangle.
// Type: [boolean] - gl.SCISSOR_TEST
// Parameters: ()
// Default: [false]

// Function: scissor()
// Type: [GLint x, GLint y, GLsizei width, GLsizei height]
// Parameters: ()
// Default: [0, 0, canvasWidth, canvasHeight]


// General
// -------
// Function: colorMask()
// Type: [GLboolean red, GLboolean green, GLboolean blue, GLboolean alpha]
// Parameters: ()
// Default: [0, 0, 0, 0]

// Function: depthMask()
// Type: [GLboolean flag]
// Parameters: ()
// Default: [true]

// Function: blendColor()
// Type: [GLclampf red, GLclampf green, GLclampf blue, GLclampf alpha]
// Parameters: ()
// Default: [0, 0, 0, 0]

// Function: viewport()
// Type: [GLint x, GLint y, GLsizei width, GLsizei height]
// Parameters: ()
// Default: [0, 0, canvasWidth, canvasHeight]

// Function: depthRange()
// Type: [GLclampf zNear, GLclampf zFar]
// Parameters: ()
// Default: [0, 1]

// Function: lineWidth()
// Type: [GLfloat width]
// Parameters: ()
// Default: [1]

let gl: WebGLRenderingContext;

export default () => {
    gl = Context.get();

    const state = new GLState(gl);

    return state;
}
