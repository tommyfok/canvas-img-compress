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
    origin.src = reader.result;
    imgs[0].innerHTML = '';
    imgs[1].innerHTML = '';
    imgs[2].innerHTML = '';
    imgs[3].innerHTML = '';
    imgs[0].appendChild(origin);
    imgs[1].appendChild(compress(origin, .8));
    imgs[2].appendChild(compress(origin, .4));
    imgs[3].appendChild(compress(origin, .1));
    Q('#previews').className = 'show';
  });

  if (file) {
    reader.readAsDataURL(file);
  }
});

function compress (origin, rate) {
  var canvas = document.createElement('canvas'),
      ctx    = canvas.getContext('2d'),
      output = new Image();

  canvas.width  = origin.width;
  canvas.height = origin.height;
  ctx.drawImage(origin, 0, 0);
  output.src = canvas.toDataURL('image/jpeg', rate);
  return output;
}

function Q (selector, all) {
  return document[all === true ? 'querySelectorAll' : 'querySelector'](selector);
}

function On (elem, event, callback) {
  elem.addEventListener(event, callback, false);
}
