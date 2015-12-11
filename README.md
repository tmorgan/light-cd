# Lightweight continuious deployment wrapping github webhooks and pm2

have a service you want to mirror a branch on github, that you want to keep up and running?
want 30 second setup, without too many bells and whistles? this might suit. no java, mongodb instance etc.

## quick start

on remote server:

$ sudo npm install light-cd -g
$ sudo npm install pm2 -g
$ cd your-project-directory-that-is-already-checked-out-from-github

note that the output of the next command changes based on your project!

$ lightcd init 

go here: https://github.com/techlayer/gripid/settings/hooks/news

add payload URL: http://194.46.136.77/xwebhook:7777
and secret:655071f5eab440988336bcc59b0b298d

then run:

sudo echo "GITHUB_WEBHOOK_SECRET="655071f5eab440988336bcc59b0b298d" >> ~/.bashrc"
sudo export GITHUB_WEBHOOK_SECRET="655071f5eab440988336bcc59b0b298d"
pm2 start lightcd /home/ubunu

then:

 pm2 start your process(es) e.g.: pm2 start index.js && pm2 start worker.js

then run:

sudo pm2 save
sudo pm2 startup

node index.js 
go here: https://github.com/techlayer/gripid/settings/hooks/news

add payload URL: http://194.46.136.77/xwebhook:7777
and secret:443b79bc741842c9b60628cb605cc67b

then run:

sudo echo "GITHUB_WEBHOOK_SECRET="443b79bc741842c9b60628cb605cc67b" >> ~/.bashrc"
sudo export GITHUB_WEBHOOK_SECRET="443b79bc741842c9b60628cb605cc67b"
pm2 start lightcd undefined

then:

 pm2 start your process(es) e.g.: pm2 start index.js && pm2 start worker.js

then run:

sudo pm2 save
sudo pm2 startup

## customisation

do whatever you want with pm2. if there is a pm2.json file in the root directory of your repo it will use that instead of the defaulted ~/.pm2/dump.pm2. 

If you have a task you want to run on git push, like an s3 push or cache rebuild or whatever, put it in the npm post install hook.
