# Lightweight continuious deployment wrapping github webhooks and pm2

have a service you want to mirror a branch on github, that you want to keep up and running?

want 30 second setup, without too many bells and whistles? this might suit. no java, mongodb instance etc.

## Quick start

on remote server:

```
sudo npm install light-cd -g
sudo npm install pm2 -g
cd your-project-directory-that-is-already-checked-out-from-github
lightcd init 
```

then just follow the instructions! (which change based on your project)

## Example instructions (lightcd init output)

```
open this url in a web browser:  https://github.com/username/repo/settings/hooks/new

add this payload URL: http://194.46.156.34/xwebhook:7777
and this (random) secret: 1565ebb4885e4e18b6ec08ceddbd04b3
leave the other defaults they are and click the "Add webhook" button.

then run these commands:

  sudo echo "GITHUB_WEBHOOK_SECRET="1565ebb4885e4e18b6ec08ceddbd04b3" >> ~/.bashrc"
  sudo export GITHUB_WEBHOOK_SECRET="1565ebb4885e4e18b6ec08ceddbd04b3"
  pm2 start lightcd /home/tony/light-cd

then start your process(es) using pm2, save the config, and setup for running on reboot e.g.:

  pm2 start index.js
  pm2 start ...
  sudo pm2 save
  sudo pm2 startup

you're done! these processes will gracefully reload after pulling remote changes when you git push.
```

## customisation

do whatever you want with pm2. if there is a pm2.json file in the root directory of your repo it will use that instead of the defaulted ~/.pm2/dump.pm2. 

If you have a task you want to run on git push, like an s3 push or cache rebuild or whatever, put it in the npm post install hook.
