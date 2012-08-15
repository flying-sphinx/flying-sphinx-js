var flyingSphinx = {
  API:           require('./flyingSphinx/api'),
  CLI:           require('./flyingSphinx/cli'),
  Configuration: require('./flyingSphinx/configuration'),
  Index:         require('./flyingSphinx/index'),
  Sphinx:        require('./flyingSphinx/sphinx')
};

flyingSphinx.api    = function() {
  return new(this.API)
}
flyingSphinx.cli    = function(command, arguments) {
  return this.CLI(this, command, arguments)
}
flyingSphinx.configuration  = function() {
  return new(this.Configuration)(this.api())
}
flyingSphinx.index  = function() {
  return new(this.Index)(this.api())
}
flyingSphinx.sphinx = function() {
  return new(this.Sphinx)(this.api())
}

module.exports = flyingSphinx;
