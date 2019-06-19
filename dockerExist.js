const commandExists = require('command-exists').sync;
var isDockerPresent = false;

module.exports = {
	dockerExist: function()
	{
		if (commandExists('docker')) {
			isDockerPresent = true;
		} else {
			isDockerPresent = false;
		}
		return isDockerPresent;
	}
}