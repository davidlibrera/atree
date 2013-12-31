class Tree
  period = 5
  width = 500
  height = 500
  colors = [
    '#ff0000',
    '#d4a017',
    '#00ff00',
    '#ffffff',
  ]
  screenConfig =
    xscreenoffset: 260
    yscreenoffset: 300
    xscreenscale: 360
    yscreenscale: 360
    ycamera: 2
    zcamera: -3


  constructor: (elem, config) ->
    @elem = document.getElementById elem
    @width = config.width or width
    @height = config.height or height
    @offset = 0
    @elem.setAttribute 'width', "#{@width}px"
    @elem.setAttribute 'height',"#{@height}px"
    @projection = new Projection screenConfig

    @ctx = @elem.getContext '2d'

    @spirals = []
    dtheta = Math.PI * 2 / colors.length
    for color, i in colors
      @spirals.push new Spiral color, dtheta * i, period

  run: ->
    @requestAnimationFrame()
    @renderFrame()

  renderFrame: ->
    @ctx.clearRect 0, 0, @width, @height
    @ctx.beginPath()
    @offset -= 1
    @offset += period if @offset <= -period
    for spiral in @spirals
      @renderObject spiral.lineSegments(@offset)

  renderObject: (segments) ->
    for s in segments
      start = @projection.to2d s.start.x, s.start.y, s.start.z
      end  =  @projection.to2d s.end.x, s.end.y, s.end.z
      @stroke s.color, s.start.alpha
      @ctx.moveTo start.x, start.y
      @ctx.lineTo end.x, end.y

  stroke: (color, alpha) ->
    @ctx.closePath()
    @ctx.stroke()
    @ctx.strokeStyle = color
    @ctx.globalAlpha = alpha
    @ctx.beginPath()

  requestAnimationFrame: ->
    window.setTimeout( =>
      @run()
    , 1000 / 24)

  spiralWithShadow = (color, period, offset) ->

tree = new Tree 'scene', {}
tree.run()
