// import QuickHull from './QuickHull'

function runner (points, options = {}) {
  var instance = new QuickHull(points)
  instance.build()
  return instance.collectFaces(options.skipTriangulation)
}

