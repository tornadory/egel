export default () => {
    try {
        const renderingContext = WebGLRenderingContext;
        const canvasWebgl = document.createElement('canvas');
        const webglContext =
        canvasWebgl.getContext('webgl') ||
        canvasWebgl.getContext('experimental-webgl');

        if (renderingContext === undefined) {
            return false;
        }

        return {
            webgl: !!webglContext,
        };
    } catch (error) {
        return false;
    }
};
