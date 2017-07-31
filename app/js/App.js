function App() {
	this.init();
}


App.prototype = Object.create(Helper.prototype);
App.prototype.init = function () {
  new Mmenu();
}

window.addEventListener( "DOMContentLoaded", function() {
	new App();
});
