var imgs = [
  Q('#img-q100'),
  Q('#img-q80'),
  Q('#img-q40'),
  Q('#img-q10')
];

On(Q('#btn-upload'), 'touchend', function () {
  Q('#input-img').click();
});

On(Q('#input-img'), 'change', function () {
  var reader = new FileReader(),
      origin = new Image(),
      file   = Q('input[type=file]').files[0];

  On(reader, 'loadend', function () {
    On(origin, 'load', function () {
      var q80 = compress(origin, .8),
          q40 = compress(origin, .4),
          q10 = compress(origin, .1);
      imgs[1].innerHTML = "文件大小：" + q80.src.length;
      imgs[2].innerHTML = "文件大小：" + q40.src.length;
      imgs[3].innerHTML = "文件大小：" + q10.src.length;
      imgs[1].appendChild(compress(origin, .8));
      imgs[2].appendChild(compress(origin, .4));
      imgs[3].appendChild(compress(origin, .1));
    });
    origin.src = reader.result;
    imgs[0].innerHTML = '文件大小：' + origin.src.length;
    imgs[0].appendChild(origin);
    Q('#previews').className = 'show';
  });

  if (file) {
    reader.readAsDataURL(file);
  }
});

function compress (origin, rate) {
  var canvas = document.createElement('canvas'),
      ctx    = canvas.getContext('2d'),
      output = new Image(),
      type   = origin.src.replace(/^.+:(\w+\/\w+);.+$/gi, '$1');

  console.log(type);

  canvas.width  = origin.width;
  canvas.height = origin.height;
  ctx.drawImage(origin, 0, 0, origin.width, origin.height);
  output.src = canvas.toDataURL(type, rate);
  return output;
}

function Q (selector, all) {
  return document[all === true ? 'querySelectorAll' : 'querySelector'](selector);
}

function On (elem, event, callback) {
  elem.addEventListener(event, callback, false);
}
