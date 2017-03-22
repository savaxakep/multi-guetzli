/**
 * Created by vsavr on 3/22/2017.
 */
var readDirFiles = require('read-dir-files'),
    shell = require('shelljs'),
    measureTime = require('measure-time');

readDirFiles.list('in', function (err, filenames) {
    if (err) return console.dir(err);

    shell.rm('-rf', 'out');
    shell.mkdir('-p', 'out');

    for(var i = 1; i < filenames.length; i++) {
        var name = filenames[i].replace('in/', '');

	    if(name.indexOf('.DS_Store') > -1)
	        continue;

        // is dir
        if(name.charAt(name.length - 1) === '/') {
            shell.mkdir('-p', 'out/' + name);

            continue;
        }

        const getElapsed = measureTime();

        console.log('start', name);

        if (shell.exec('guetzli -quality 100 in/' + name + ' out/' + name).code !== 0) {
            shell.echo('Error: not fount guetzli or etc error. Install link: https://github.com/google/guetzli/');
            shell.exit(1);
        }

        const elapsed = getElapsed();
        console.log('end:', elapsed.seconds, 'seconds');
    }
});