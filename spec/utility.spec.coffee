describe "A color", ->

  path = require 'path'
  u = require path.join('..', 'lib', 'utility')

  describe "given in rgb", ->
    it "should be convert to hex properly", ->
      expect(u.rgbToHex(19, 55, 255)).toBe "#1337ff"

  describe "given in hex", ->
    it "should be converted to rgb triplet properly", ->
      expect(u.hexToRgb("#1337ff")).toEqual {r: 19, g: 55, b: 255}

  describe "given as component", ->
    it "should be convtered to hex properly", ->
      expect(u.componentToHex(35)).toBe "23"

    it "should do padding correctly", ->
      expect(u.componentToHex(2)).toBe "02"
