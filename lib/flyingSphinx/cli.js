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
      flyingSphinx.configuration().rebuildFromFile(arguments[0]);
      break;
    default:
      console.log("Unknown command " + command);
  }
}

module.exports = CLI;
