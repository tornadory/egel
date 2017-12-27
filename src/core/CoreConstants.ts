// Culling
export const CULL_NONE: number = -1;
export const CULL_BACK: number = 0x0405;
export const CULL_FRONT: number = 0x0404;
export const CULL_FRONT_AND_BACK: number = 0x0408;

// Draw style
export const DRAW_POINTS: number = 0;
export const DRAW_LINES: number = 1;
export const DRAW_LINE_LOOP: number = 2;
export const DRAW_LINE_STRIP: number = 3;
export const DRAW_TRIANGLES: number = 4;

// Maximum device pixel ratio
export const MAX_DEVICE_PIXEL_RATIO: number = 2; // Could even be lowered to 1.5 - 1.75

// Default renderer settings
export const RENDERER_DEFAULT_WIDTH: number = 1280;
export const RENDERER_DEFAULT_HEIGHT: number = 720;
export const RENDERER_DEFAULT_ASPECT_RATIO: number = RENDERER_DEFAULT_WIDTH / RENDERER_DEFAULT_HEIGHT;

// Precision
export const PRECISION: string = 'highp';
