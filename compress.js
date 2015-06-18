var imgs = [
      Q('#img-q100'),
      Q('#img-q80'),
      Q('#img-q40'),
      Q('#img-q10')
    ],
    sizeRatio = 1;

On(Q('#btn-upload'), 'click', function () {
  Q('#input-img').click();
});

On(Q('#input-img'), 'change', function () {
  var reader = new FileReader(),
      origin = new Image(),
      file   = Q('input[type=file]').files[0];

  On(reader, 'loadend', function () {
    if (reader.result.length > 1024 * 1024) {
      sizeRatio = Math.pow(1024 * 1024 / reader.result.length, 0.5);
    }
    On(origin, 'load', function () {
      EXIF.getData(origin, function() {
        var orient = EXIF.getTag(this, 'Orientation') || 1,
            q80    = compress(origin, .8, orient),
            q40    = compress(origin, .4, orient),
            q10    = compress(origin, .1, orient);

        imgs[1].innerHTML = "文件大小：" + (q80.src.length / 1024).toFixed(2) + 'KB';
        imgs[2].innerHTML = "文件大小：" + (q40.src.length / 1024).toFixed(2) + 'KB';
        imgs[3].innerHTML = "文件大小：" + (q10.src.length / 1024).toFixed(2) + 'KB';
        imgs[1].appendChild(q80);
        imgs[2].appendChild(q40);
        imgs[3].appendChild(q10);
      });
    });
    origin.src = 'data:image/jpeg;base64,' + reader.result.split(',')[1];
    imgs[0].innerHTML = '文件大小：' + (origin.src.length / 1024).toFixed(2) + 'KB';
    imgs[0].appendChild(origin);
    Q('#previews').className = 'show';
  });

  if (file) {
    reader.readAsDataURL(file);
  }
});

function compress (origin, rate, orient) {
  var canvas = document.createElement('canvas'),
      ctx    = canvas.getContext('2d'),
      output = new Image(),
      type   = origin.src.replace(/^.+:(\w+\/\w+);.+$/gi, '$1'),
      osize  = {
        width: Math.max(origin.naturalWidth, origin.width),
        height: Math.max(origin.naturalHeight, origin.height)
      },
      size   = {
        width: osize.width * sizeRatio,
        height: osize.height * sizeRatio
      };

  canvas.style.width  = size.width + 'px';
  canvas.style.height = size.height + 'px';

  function setSize (cvs, width, height) {
    cvs.width  = width;
    cvs.height = height;
  }

  setSize(canvas, size.width, size.height);

   if (parseInt(orient) === 6) {
     ctx.save();
     ctx.rotate(Math.PI / 2);
     ctx.translate(0, -size.width);
     ctx.drawImage(origin, 0, 0, osize.height, osize.width, 0, 0, size.height, size.width);
     ctx.restore();
   }

   if (parseInt(orient) === 8) {
     ctx.save();
     ctx.rotate(-Math.PI / 2);
     ctx.translate(-size.height, 0);
     ctx.drawImage(origin, 0, 0, size.height, size.width);
     ctx.restore();
   }

   if (parseInt(orient) === 1) {
     ctx.drawImage(origin, 0, 0, size.width, size.height);
   }

//   ctx.drawImage(origin, 0, 0, size.width, size.height);

  output.src = canvas.toDataURL(type, rate);

  return output;
}

function Q (selector, all) {
  return document[all === true ? 'querySelectorAll' : 'querySelector'](selector);
}

function On (elem, event, callback) {
  elem.addEventListener(event, callback, false);
}
