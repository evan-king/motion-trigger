
A small hacking exercise.  Provides a limited-access means of allowing security camera software
'motion' (https://github.com/Motion-Project/motion) to notify Slack of current activities.

# Setup

  - Create a Slack bot and set the environment variable SLACK_TOKEN to the bot's API key.
  
  - Create a 'motion' channel in your Slack team and invite the bot into it.
  
  - Register a webtask.io account and set up a node8 profile following these directions: https://tomasz.janczuk.org/2017/09/auth0-webtasks-and-node-8.html
    - If you're a careful developer, chances are you'd never globally install anything.
      (Maybe you're so careful you'd even like to effortlessly fork your entire local
      operating environment at whim, in which case you might be interested in 
      https://github.com/evan-king/grub2-zfs-be.)  Built-in package scripts have you
      covered for all but this step, which is instead global-sanitized here for
      convenience:
        
        ```bash
        ./node_modules/wt-cli/bin/wt init -p node8 \
            --url https://sandbox.auth0-extend.com \
            --token $(./node_modules/wt-cli/bin/wt profile get default --field token) \
            --container $(./node_modules/wt-cli/bin/wt profile get default --field container)
        ```
       
  - Clone this project and use `npm run deploy-webtask` to install it to your webtask.io account
    - Use `npm run logs` to monitor, but at present there's no logging.
    
  - Install motion (`sudo apt install motion`) and configure at `/etc/motion/motion.conf`
    - Note: Even if generating images for 'first' activity during a motion sequence, they will
      not appear until the sequence is finished.  For prompt visual reporting to Slack, motion
      events must be kept short with quick idle timeouts and small maximum durations.
    
    - For the events where you'd like to be notified of activity, supply this script:
      `curl request POST https://<your-webtask-subdomain>.sandbox.auth0-extend.com/notify?motion=1`
     
    - For the events supplying a file you'd like to post, supply this script:
      `curl request POST https://<your-webtask-subdomain>.sandbox.auth0-extend.com/notify?image=1 --data-binary "@%f"`
    
  - Modify as desired to support custom messages/channels, distinguish between multiple cameras,
    link to relevant live feeds, etc.