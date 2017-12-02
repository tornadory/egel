import { mat4, quat, vec3 } from 'gl-matrix';

export function clamp(value: number, min: number, max: number) {
    return Math.max(Math.min(value, max), min);
}

export function lerp(min: number, max: number, alpha: number) {
    return min + (max - min) * alpha;
}

export function lookAt(eye: vec3, target: vec3, up: vec3) {
    const quatOut = quat.create();
    const x = vec3.create();
    const y = vec3.create();
    const z = vec3.create();

    vec3.sub(z, eye, target);

    if (vec3.squaredLength(z) === 0) {
        // eye and target are in the same position
        z[2] = 1;
    }

    vec3.normalize(z, z);
    vec3.cross(x, up, z);

    if (vec3.squaredLength(x) === 0) {
        // eye and target are in the same vertical
        z[2] += 0.0001;
        vec3.cross(x, up, z);
    }

    vec3.normalize(x, x);
    vec3.cross(y, z, x);

    quat.setAxes(quatOut, z, x, y);
    quat.invert(quatOut, quatOut);

    return quatOut;
}
