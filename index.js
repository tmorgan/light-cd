var http = require('http')
var fs = require('fs');
var shelljs = require('shelljs');
var createHandler = require('github-webhook-handler')

var main = function() {

  http.createServer(function (req, res) {
    handler(req, res, function (err) {
      res.statusCode = 404
      res.end('no such location')
    })
  }).listen(7777);

  var handler = createHandler({ path: '/xwebhook', secret: process.env.GITHUB_WEBHOOK_SECRET })

  handler.on('error', function (err) {
    console.error('Error:', err.message)
  })

  handler.on('push', function (event) {
    if (event.payload.repository.name !== 'gripid') return;
    console.log(shelljs.exec('git pull').output)
    console.log(shelljs.exec('npm install').output)
    console.log(shelljs.exec('pm2 gracefulReload all').output)
    console.log('Received a push event for %s to %s',
    event.payload.ref)
  })
}

var _testUrl = /^git.*?:(.*)\.git$|https?:\/\/.*?\/(.*)\.git$/
var testUrl = function(url) {
  var match = url.match(_testUrl);
  if (!match) {
    console.log('Warning: this either isn\'t a git(hub) repo or there is a problem parsing the .git/config ini file.\n');
    console.log('please fix this and run again which will replace USERNAME/REPONAME below with your username (or organisation name) and repository\n');
    var match = ['','USERNAME/REPONAME',''];
  }
  match = match[1] || match[2];
  return match;
};
module.exports.testUrl = testUrl;

var init = function() {
  var ini = require('ini');
  var uuid = require('uuid');
  try {
    var config = ini.parse(fs.readFileSync('../gripid/.git/config','utf-8'));
    var url = config['remote "origin"']['url']
  } catch (e) {
    url = '';
  }
  var match = testUrl(url);
  var secret = uuid.v4().replace(/-/g,'');
  require('request').get('http://jsonip.com', {json:true}, function(err, req, res) {
    if (err) {
      console.log('Warning: there was a problem with either the internet connection or the free service jsonip.com,\n'+
                  'please replace IPADDRESS below with the remote ip or dns address of this box!\n\n\n');
      res = {ip:'IPADDRESS'};
    };
    console.log('open this url in a web browser:  https://github.com/'+ match + '/settings/hooks/new\n\n'+
                'add this payload URL: http://'+res.ip+'/xwebhook:7777\n'+
                'and this (random) secret: ' + secret+ '\n'+
                'leave the other defaults they are and click the "Add webhook" button.\n\n'+
                'then run these commands:\n\n'+
                '  echo "GITHUB_WEBHOOK_SECRET="'+secret+'" >> ~/.bashrc"\n'+
                '  export GITHUB_WEBHOOK_SECRET="'+secret+'"\n'+
                '  pm2 start lightcd '+process.env.PWD+'\n\n'+
                'then start your process(es) using pm2, save the config, and setup for running on reboot e.g.:\n\n'+
                '  pm2 start index.js\n' +
                '  pm2 start ...\n' +
                '  sudo pm2 save\n' +
                '  sudo pm2 startup\n\n' +
                'you\'re done! these processes will gracefully reload after pulling remote changes when you git push.')
  })
}

var USAGE = 'lightcd init OR lightcd /dir/to/watch/after/configuration'
var run = function() {
  if (process.argv.length < 3) {
    return console.log(USAGE);
  }
  var lastArg = process.argv[process.argv.length-1];
  if (lastArg === 'init') {
    init()
  } else if (lastArg.length && lastArg[0] === '/') {
    process.chdir(lastArg);
    main()
  }
}
module.exports.run = run;

if (require.main === module) {
  run();
}
