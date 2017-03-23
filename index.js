/**
 * Created by vsavr on 3/22/2017.
 */
var readDirFiles = require('read-dir-files'),
    shell = require('shelljs'),
    measureTime = require('measure-time'),
    isOsx = require('is-osx');

readDirFiles.list('in', function (err, filenames) {
    if (err) return console.dir(err);

    shell.rm('-rf', 'out');
    shell.mkdir('-p', 'out');

    for(var i = 1; i < filenames.length; i++) {
        var name = (isOsx()) ? filenames[i].replace('in/', '')
            : filenames[i].replace('in\\', '').replace(new RegExp(/\\/g), '/');

        var formats = ['png', 'jpg'],
            currentFormat = filenames[i].substring(filenames[i].length - 3, filenames[i].length);

        if(isOsx() && name.indexOf('.DS_Store') > -1)
            continue;

        // is dir
        if(name.charAt(name.length - 1) === '/') {
            shell.mkdir('-p', 'out/' + name);

            continue;
        }

        console.log('start', name);

        if(formats.find(function (format) {return format === currentFormat;})) {
            const getElapsed = measureTime();

            if (shell.exec('guetzli -quality 90 "in/' + name + '" "out/' + name + '"').code !== 0) {
                shell.echo('Error: not fount guetzli or etc error. Install link: https://github.com/google/guetzli/');
                shell.exit(1);
            }

            const elapsed = getElapsed();
            console.log('end:', elapsed.seconds, 'seconds');
        } else
            shell.echo('Error: availables formats (png, jpg)');
    }
});