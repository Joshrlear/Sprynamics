import { Injectable } from '@angular/core';

import 'fabric';
declare let fabric;

@Injectable()
export class ObjectFactoryService {

  defaultShadow = {
    color: 'rgba(0,0,0,0)',
    blur: 20,
    offsetX: 10,
    offsetY: 10,
    opacity: 0.6
  }

  constructor() { }

  _uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Creates an object with a unique ID, applies the default shadow, adds it to the canvas and selects it.
   */
  addObject(obj, canvas, center?) {
    const id = this._uuidv4();
    obj.set({ id });
    console.log('Created object with id ' + id);
    obj.setShadow(this.defaultShadow);
    canvas.add(obj).setActiveObject(obj);
    if (center) canvas.centerObject(obj);
    return obj;
  }

  createText(canvas) {
    const text = new fabric.IText('Type text here...', {
      left: 50,
      top: 50,
      width: 150,
      fontSize: 20,
      fontFamily: 'Roboto',
      hasRotatingPoint: true,
      textContentType: 'plain', // custom
      textUserData: 'name', // custom
      userEditable: false, // custom
      textFieldName: ''      // custom
    });
    text.toObject = this.extendFabricObject(text,
      [
        'textContentType',
        'textUserData',
        'textFieldName',
        'userEditable'
      ]);
    return this.addObject(text, canvas);
  }

  createParagraph(canvas) {
    const loremIpsum = 'Lorem ipsum dolor sit amet, ' +
      'consectetur adipisicing elit, sed do eiusmod tempor ' +
      'incididunt ut labore et dolore magna aliqua. Ut enim ' +
      'ad minim veniam, quis nostrud exercitation ullamco ' +
      'laboris nisi ut aliquip exea commodo consequat.';
    const paragraph = new fabric.Textbox(loremIpsum, {
      left: 50,
      top: 50,
      width: 150,
      fontSize: 20,
      fontFamily: 'Roboto',
      hasRotatingPoint: true,
      textContentType: 'plain', // custom
      textUserData: 'name',    // custom
      userEditable: false,    // custom
      textFieldName: ''      // custom
    });
    paragraph.toObject = this.extendFabricObject(paragraph,
      [
        'textContentType',
        'textUserData',
        'textFieldName',
        'userEditable'
      ]);
    return this.addObject(paragraph, canvas);
  }

  createRectangle(canvas) {
    const rectangle = new fabric.Rect({
      width: 200,
      height: 200,
      stroke: '#000000ff',
      strokeWidth: 0,
      fill: '#00e676',
      hasRotatingPoint: true
    });
    return this.addObject(rectangle, canvas);
  }

  createPolygon(numSides, canvas) {
    const pathString = this._getRegularPolygonPath(0, 0, 50, numSides);
    const polygon = new fabric.Path(pathString,
      {
        stroke: 'black',
        strokeWidth: 1,
        fill: '#00e676',
        originX: 'center',
        originY: 'center',
        numSides: numSides,
      });
    return this.addObject(polygon, canvas);
  }

  createLine(canvas) {
    const line = new fabric.Line({
      width: 200,
      stroke: '#00e676',
      hasRotatingPoint: true
    });
    return this.addObject(line, canvas);
  }

  createLogo(canvas) {
    const logo = new fabric.Image.fromURL('/assets/logo.png',
      (img) => {
        img.scaleToHeight(100);
        img.isLogo = true;
        img.logoType = 'sprynamics';

        img.toObject = this.extendFabricObject(img,
          [
            'isLogo',
            'logoType'
          ]);

        this.addObject(img, canvas);
      }, { crossOrigin: 'Anonymous' });
    return logo;
  }

  createClone(obj: any, canvas) {
    const object = obj.toObject();
    fabric.util.enlivenObjects([object], (objects) => {
      objects.forEach(object => {
        object.set("top", object.top + 5);
        object.set("left", object.left + 5);
        object.setShadow(this.defaultShadow);
        this.addObject(object, canvas);
      });
      canvas.renderAll();
    });
    return object;
  }

  /**
   * Creates the background, safety line and print line of the product.
   */
  createProductBase(canvas) {
    // the base properties that all base objects will extend
    const baseObj = {
      width: 912,
      height: 586,
      selectable: false,
      hasControls: false,
    }

    // the base extension properties that all base objects will add
    const baseExt = [
      'selectable',
      'hasControls',
    ];

    // Create background
    const background = new fabric.Rect(Object.assign(baseObj,
      {
        fill: '#ffffff',
        isBackground: true,
      }));
    background.toObject = this.extendFabricObject(background,
      baseExt.concat(['isBackground']));

    // Create safety line
    const safeArea = new fabric.Rect(Object.assign(baseObj,
      {
        fill: 'transparent',
        stroke: '#777',
        strokeDashArray: [5, 5],
        isHidden: true,
      }));
    safeArea.toObject = this.extendFabricObject(safeArea,
      baseExt.concat(['isHidden']));

    // Create print line
    const printArea = new fabric.Rect(Object.assign(baseObj, {
      fill: 'transparent',
      stroke: '#f00',
      strokeDashArray: [5, 5],
      isBoundBox: true,
      isHidden: true,
    }));
    printArea.toObject = this.extendFabricObject(printArea,
      baseExt.concat(['isHidden', 'isBoundBox']));

    // Add objects to center of canvas
    this.addObject(background, canvas, true);
    this.addObject(safeArea, canvas, true);
    this.addObject(printArea, canvas, true);

    // Return object of the base objects
    return { background, safeArea, printArea };
  }

  /**
   * Takes an array of fields to extend a Fabric object with for serialization.
   * The array should consist of strings to bind to 'this', or objects for literal values.
   * example: ['textContentType', 'textUserData', {isText: true}]
   * In the above example, the result will be: {textContentType: this.textContentType, textUserData: this.textUserData, isText: true}
   */
  extendFabricObject(obj: any, fields: any[]) {
    return (function (toObject) {
      return function () {
        const extFields = {};
        fields.forEach(field => {
          if (typeof field === 'string') {
            extFields[field] = this[field];
          } else {
            Object.assign(extFields, field);
          }
        })
        return fabric.util.object.extend(toObject.call(this), extFields);
      };
    })(obj.toObject);
  }

  /**
   * Converts polar coordinates to cartesian coordinates.
   */
  private _polarToCartesian(centerX, centerY, radius, angleInDegrees) {

    var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }

  /**
   * Returns a path for a regular polygon centered at x,y with a radius specified with numVertexes sides.
   */
  private _getRegularPolygonPath(x, y, radius, numVertexes) {

    const interiorAngle = 360 / numVertexes;

    // rotationAdjustment rotates the path by 1/2 the interior angle so that the polygon always has a flat side on the bottom
    // This isn't strictly necessary, but it's how we tend to think of and expect polygons to be drawn
    let rotationAdjustment = 0;
    if (numVertexes % 2 == 0) {
      rotationAdjustment = interiorAngle / 2;
    }

    const d = [];
    for (var i = 0; i < numVertexes; i++) {
      // var coord = coordList[i];
      const coord = this._polarToCartesian(x, y, radius, i * interiorAngle + rotationAdjustment);

      if (i == 0) {
        d.push('M ');

        // If an odd number of vertexes, add an additional point at the top of the polygon-- this will shift the calculated center
        // point of the shape so that the centerpoint of the polygon is at x,y (otherwise the center is mis-located)
        if (numVertexes % 2 == 1) {
          d.push(0);
          d.push(radius);
        }

        d.push('M');

      } else {
        d.push(" L ");
      }

      d.push(coord.x);
      d.push(coord.y);
    }

    let pathString = d.join(" ");

    pathString += " Z";

    return pathString;

  }

}
