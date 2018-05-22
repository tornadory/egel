// https://github.com/spite/GLStateCache.js/blob/master/GLStateCache.js

export default (() => {
    const cache = {
        enable: {},
        useProgram: {},
        bindBufferTargetArray: {},
        bindBufferTargetElementArray: {},
        bindRenderbufferTarget: {},
        bindRenderbufferBuffer: {},
        bindFramebufferTarget: {},
        bindFramebufferFramebuffer: {},
        bindTexture2D: {},
        bindTextureCubeMap: {},
        activeTexture: {},
        blendEquation: {},
        viewportX: 0,
        viewportY: 0,
        viewportW: 0,
        viewportH: 0,
        scissorX: 0,
        scissorY: 0,
        scissorW: 0,
        scissorH: 0,
        depthRangeNear: 0,
        depthRangeFar: 0,
        cullFaceMode: {},
        frontFaceMode: {},
        lineWidth: 0,
        polygonOffsetFactor: 0,
        polygonOffsetUnits: 0,
        pixelStorei: [],
    };

    function _h(fn, cb) {
        return function() {
            let res;

            if (!cb.apply(this, arguments)) {
                res = fn.apply(this, arguments);
            }

            return res;
        };
    }

    WebGLRenderingContext.prototype.enable = _h(WebGLRenderingContext.prototype.enable, (cap) => {
        const cached = (cache.enable[cap] === true);

        cache.enable[cap] = true;

        return cached;
    });

    WebGLRenderingContext.prototype.disable = _h(WebGLRenderingContext.prototype.disable, (cap) => {
        const cached = (cache.enable[cap] === false);

        cache.enable[cap] = false;

        return cached;
    });

    WebGLRenderingContext.prototype.useProgram = _h(WebGLRenderingContext.prototype.useProgram, (program) => {
        const cached = (cache.useProgram === program);

        cache.useProgram = program;

        return cached;
    });

    WebGLRenderingContext.prototype.bindBuffer = _h(WebGLRenderingContext.prototype.bindBuffer, (target, buffer) => {
        let cached;

        switch (target) {
            case this.ARRAY_BUFFER:
                cached = (cache.bindBufferTargetArray === buffer);
                cache.bindBufferTargetArray = buffer;
                break;
            case this.ELEMENT_ARRAY_BUFFER:
                cached = (cache.bindBufferTargetElementArray === buffer);
                cache.bindBufferTargetElementArray = buffer;
                break;
            default:
                break;
        }

        return cached;
    });

    WebGLRenderingContext.prototype.bindRenderbuffer = _h(WebGLRenderingContext.prototype.bindRenderbuffer, (target, buffer) => {
        const cached = (cache.bindRenderbufferTarget === target) && (cache.bindRenderbufferBuffer === buffer);

        cache.bindRenderbufferTarget = target;
        cache.bindRenderbufferBuffer = buffer;

        return cached;
    });

    WebGLRenderingContext.prototype.bindFramebuffer = _h(WebGLRenderingContext.prototype.bindFramebuffer, (target, framebuffer) => {
        const cached = (cache.bindFramebufferTarget === target) && (cache.bindFramebufferFramebuffer === framebuffer);

        cache.bindFramebufferTarget = target;
        cache.bindFramebufferFramebuffer = framebuffer;

        return cached;
    });

    WebGLRenderingContext.prototype.bindTexture = _h(WebGLRenderingContext.prototype.bindTexture, (target, texture) => {
        let cached;

        switch (target) {
            case this.TEXTURE_2D:
                cached = (cache.bindTexture2D === texture);
                cache.bindTexture2D = texture;
                break;
            case this.TEXTURE_CUBE_MAP:
                cached = (cache.bindTextureCubeMap === texture);
                cache.bindTextureCubeMap = texture;
                break;
            default:
                break;
        }

        return cached;
    });

    WebGLRenderingContext.prototype.activeTexture = _h(WebGLRenderingContext.prototype.activeTexture, (texture) => {
        const cached = (cache.activeTexture === texture);

        cache.activeTexture = texture;

        return cached;
    });

    WebGLRenderingContext.prototype.blendEquation = _h(WebGLRenderingContext.prototype.blendEquation, (mode) => {
        const cached = (cache.blendEquation === mode);

        cache.blendEquation = mode;

        return cached;
    });

    WebGLRenderingContext.prototype.viewport = _h(WebGLRenderingContext.prototype.viewport, (x, y, w, h) => {
        const cached = (cache.viewportX === x) && (cache.viewportY === y) && (cache.viewportW === w) && (cache.viewportH === h);

        cache.viewportX = x;
        cache.viewportY = y;
        cache.viewportW = w;
        cache.viewportH = h;

        return cached;
    });

    WebGLRenderingContext.prototype.scissor = _h(WebGLRenderingContext.prototype.scissor, (x, y, w, h) => {
        const cached = (cache.scissorX === x) && (cache.scissorY === y) && (cache.scissorW === w) && (cache.scissorH === h);

        cache.scissorX = x;
        cache.scissorY = y;
        cache.scissorW = w;
        cache.scissorH = h;

        return cached;
    });

    WebGLRenderingContext.prototype.depthRange = _h(WebGLRenderingContext.prototype.depthRange, (near, far) => {
        const cached = cache.depthRangeNear === near && cache.depthRangeFar === far;

        cache.depthRangeNear = near;
        cache.depthRangeFar = far;

        return cached;
    });

    WebGLRenderingContext.prototype.cullFace = _h(WebGLRenderingContext.prototype.cullFace, (mode) => {
        const cached = cache.cullFaceMode === mode;

        cache.cullFaceMode = mode;

        return cached;
    });

    WebGLRenderingContext.prototype.frontFace = _h(WebGLRenderingContext.prototype.frontFace, (mode) => {
        const cached = cache.frontFaceMode === mode;

        cache.frontFaceMode = mode;

        return cached;
    });

    WebGLRenderingContext.prototype.lineWidth = _h(WebGLRenderingContext.prototype.lineWidth, (width) => {
        const cached = cache.lineWidth === width;

        cache.lineWidth = width;

        return cached;
    });

    WebGLRenderingContext.prototype.polygonOffset = _h(WebGLRenderingContext.prototype.polygonOffset, (factor, units) => {
        const cached = cache.polygonOffsetFactor === factor && cache.polygonOffsetUnits === units;

        cache.polygonOffsetFactor = factor;
        cache.polygonOffsetUnits = units;

        return cached;
    });

    WebGLRenderingContext.prototype.pixelStorei = _h(WebGLRenderingContext.prototype.pixelStorei, (pname, param) => {
        const cached = (cache.pixelStorei[pname] === param);

        cache.pixelStorei[pname] = param;

        return cached;
    });

    return cache;
})();
