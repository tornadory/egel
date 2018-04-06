// Vendor
import GLState from 'nanogl-state';

// Core
import * as Context from './Context';

// Documentation
// -------------

// enableBlend() - Activates blending of the computed fragment color values.
// [boolean] - gl.BLEND

// enableCullface() - Activates culling of polygons.
// [boolean] - gl.CULL_FACE

// enableDepthTest() - Activates depth comparisons and updates to the depth buffer.
// [boolean] - gl.DEPTH_TEST

// enableDither() - Activates dithering of color components before they get written to the color buffer.
// [boolean] - gl.DITHER

// enablePolygonOffset() - Activates adding an offset to depth values of polygon's fragments.
// [boolean] - gl.POLYGON_OFFSET_FILL

// enableScissor() - Activates the scissor test that discards fragments that are outside of the scissor rectangle.
// [boolean] - gl.SCISSOR_TEST

// enableStencil() - Activates stencil testing and updates to the stencil buffer.
// [boolean] - gl.STENCIL_TEST

// blendColor()
// [GLclampf red, GLclampf green, GLclampf blue, GLclampf alpha]

// blendEquation()
// [GLenum mode]
// (GLenum FUNC_ADD, GLenum FUNC_SUBTRACT, GLenum FUNC_REVERSE_SUBTRACT)

// blendEquationSeparate()
// [GLenum modeRGB, GLenum modeAlpha]
// (GLenum FUNC_ADD, GLenum FUNC_SUBTRACT, GLenum FUNC_REVERSE_SUBTRACT)

// blendFunc()
// [GLenum sfactor, GLenum dfactor] (source, distination)
// (GLenum ZERO, GLenum ONE, GLenum SRC_COLOR, GLenum ONE_MINUS_SRC_COLOR, GLenum DST_COLOR, GLenum ONE_MINUS_DST_COLOR, GLenum SRC_ALPHA, GLenum ONE_MINUS_SRC_ALPHA, GLenum DST_ALPHA, GLenum ONE_MINUS_DST_ALPHA, GLenum SRC_ALPHA_SATURATE, GLenum CONSTANT_COLOR, GLenum ONE_MINUS_CONSTANT_COLOR, GLenum CONSTANT_ALPHA, GLenum ONE_MINUS_CONSTANT_ALPHA, GLenum SRC_ALPHA_SATURATE)

// blendFuncSeparate()
// [GLenum srcRGB, GLenum dstRGB, GLenum srcAlpha, GLenum dstAlpha]
// (GLenum ZERO, GLenum ONE, GLenum SRC_COLOR, GLenum ONE_MINUS_SRC_COLOR, GLenum DST_COLOR, GLenum ONE_MINUS_DST_COLOR, GLenum SRC_ALPHA, GLenum ONE_MINUS_SRC_ALPHA, GLenum DST_ALPHA, GLenum ONE_MINUS_DST_ALPHA, GLenum SRC_ALPHA_SATURATE, GLenum CONSTANT_COLOR, GLenum ONE_MINUS_CONSTANT_COLOR, GLenum CONSTANT_ALPHA, GLenum ONE_MINUS_CONSTANT_ALPHA, GLenum SRC_ALPHA_SATURATE)

// colorMask()
// [GLboolean red, GLboolean green, GLboolean blue, GLboolean alpha]

// cullFace()
// [GLenum mode]
// (FRONT, BACK, FRONT_AND_BACK)

// depthFunc()
// [GLenum func]
// (GLenum NEVER, GLenum LESS, GLenum EQUAL, GLenum LEQUAL, GLenum GREATER, GLenum NOTEQUAL, GLenum GEQUAL, GLenum ALWAYS)

// depthMask()
// [GLboolean flag]

// depthRange()
// [GLclampf zNear, GLclampf zFar]

// frontFace()
// [GLenum mode]
// (GLenum CW, GLenum CWW)

// lineWidth()
// [GLfloat width]

// polygonOffset()
// [GLfloat factor, GLfloat units]

// scissor()
// [GLint x, GLint y, GLsizei width, GLsizei height]

// stencilFunc()
// [GLenum func, GLint ref, GLuint mask]
// (GLenum NEVER, GLenum LESS, GLenum EQUAL, GLenum LEQUAL, GLenum GREATER, GLenum NOTEQUAL, GLenum GEQUAL, GLenum ALWAYS)

// stencilFuncSeparate()
// [GLenum face, GLenum func, GLint ref, GLuint mask]
// (GLenum NEVER, GLenum LESS, GLenum EQUAL, GLenum LEQUAL, GLenum GREATER, GLenum NOTEQUAL, GLenum GEQUAL, GLenum ALWAYS)

// stencilMask()
// [GLuint mask]

// stencilMaskSeparate()
// [GLenum face, GLuint mask]

// stencilOp()
// [GLenum fail, GLenum fail, GLenum zpass]

// stencilOpSeparate()
// [GLenum face, GLenum fail, GLenum zfail, GLenum zpass]

// viewport()
// [GLint x, GLint y, GLsizei width, GLsizei height]

let gl: WebGLRenderingContext;

export default () => {
    gl = Context.get();

    const state = new GLState(gl);

    return state;
}
