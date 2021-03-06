var Stream    =  require('stream')
  , es        =  require('event-stream');


function objectStream () {
  var s = new Stream()
    , objects = 0;

  var iv = setInterval(
      function () {
        s.emit('data', { id: objects, created: new Date() });
        if (++objects === 3) {
            s.emit('end');
            clearInterval(iv);
        }
      }
    , 20);
  return s;
}

function tap () {
  return es.through(
    function write (data) {
      console.log('\n' + data);
      this.emit('data', data);
    }
  );
}

function padId () {
  return es.mapSync(function (obj) {
    obj.id = '000' + obj.id;
    return obj;
  });
}

objectStream()
  .pipe(es.stringify())   // prepare for printing
  .pipe(tap())            // print intermediate result
  .pipe(es.parse())       // convert back to object
  .pipe(padId())          // change it a bit
  .pipe(es.stringify())   // prepare for printing
  .pipe(process.stdout);  // print final result
