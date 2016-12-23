/**
 * Created by Karim Luy on 23/12/2016.
 */
function add3D(v, u) {
    return [v[0] + u[0], v[1] + u[1], v[2] + u[2]];
}
function sub3D(v, u) {
    return [v[0] - u[0], v[1] - u[1], v[2] - u[2]];
}
function scalar3D(a, v) {
    return [a * v[0], a * v[1], a * v[2]];
}

function trianglePointPick(v1, v2, v3, a, b) {
    //finding point in a  triangle with verticesIceberg v1,v2,v3:
    // _   _      _    _       _    _
    // x = v1 + a(v2 - v1) + b(v3 - v1)
    return add3D(v1, add3D(scalar3D(a, sub3D(v2, v1)), scalar3D(b, sub3D(v3, v1))));
}