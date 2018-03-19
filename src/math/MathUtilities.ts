// Vendor
import {
    quat as Quat,
    vec3 as Vec3,
} from 'gl-matrix';

export function clamp(value: number, min: number, max: number) {
    return Math.max(Math.min(value, max), min);
}

export function lerp(min: number, max: number, alpha: number) {
    return min + (max - min) * alpha;
}

export function lookAt(eye: Vec3, target: Vec3, up: Vec3) {
    const quatOut = Quat.create();
    const x = Vec3.create();
    const y = Vec3.create();
    const z = Vec3.create();

    Vec3.sub(z, eye, target);

    if (Vec3.squaredLength(z) === 0) {
        // eye and target are in the same position
        z[2] = 1;
    }

    Vec3.normalize(z, z);
    Vec3.cross(x, up, z);

    if (Vec3.squaredLength(x) === 0) {
        // eye and target are in the same vertical
        z[2] += 0.0001;
        Vec3.cross(x, up, z);
    }

    Vec3.normalize(x, x);
    Vec3.cross(y, z, x);

    Quat.setAxes(quatOut, z, x, y);
    Quat.invert(quatOut, quatOut);

    return quatOut;
}
