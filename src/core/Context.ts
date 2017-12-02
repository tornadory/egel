let gl: WebGLRenderingContext;

export function set(
    context: WebGLRenderingContext,
) {
    gl = context;
}

export function get(): WebGLRenderingContext {
    return gl;
}
