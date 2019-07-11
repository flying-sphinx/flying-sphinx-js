var CLI = function(flyingSphinx, command, arguments) {
  switch(command) {
    case 'configure':
      flyingSphinx.configuration().uploadFromFile(arguments[0]);
      break;
    case 'index':
      flyingSphinx.index().run(arguments);
      break;
    case 'start':
      flyingSphinx.sphinx().start();
      break;
    case 'stop':
      flyingSphinx.sphinx().stop();
      break;
    case 'restart':
      flyingSphinx.sphinx().restart();
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
