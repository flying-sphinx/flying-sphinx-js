var CLI = function(flyingSphinx, command, arguments) {
  switch(command) {
    case 'configure':
      flyingSphinx.configuration().uploadFromFile(arguments[0]);
      break;
    case 'index':
      flyingSphinx.index().run(arguments, function(log) {
        console.log(log);
      });
      break;
    case 'start':
      flyingSphinx.sphinx().start(function() {
        console.log('Sphinx started');
      });
      break;
    case 'stop':
      flyingSphinx.sphinx().stop(function() {
        console.log('Sphinx stopped');
      });
      break;
    case 'restart':
      var sphinx = flyingSphinx.sphinx();
      sphinx.stop(function() {
        console.log('Sphinx stopped');
        sphinx.start(function() {
          console.log('Sphinx started');
        });
      });
      break;
    case 'rebuild':
      var sphinx = flyingSphinx.sphinx();
      sphinx.stop(function() {
        console.log('Sphinx stopped');
        flyingSphinx.index().run([], function(log) {
          console.log(log);
          sphinx.start(function() {
            console.log('Sphinx started');
          });
        });
      });
      break;
    default:
      console.log("Unknown command " + command);
  }
}

module.exports = CLI;
