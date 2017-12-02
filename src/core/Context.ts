let gl: WebGLRenderingContext;

export function set(
    _gl: WebGLRenderingContext,
) {
    gl = _gl;
}

export function get(): WebGLRenderingContext {
    return gl;
}
