"use strict";

const
    R = require('ramda'),
    read = require('raw-body'),
    slack = new (require('slack'))(),
    
    // No API wrappers or SDKs found that correctly form files.upload requests
    agent = require('superagent-promise')(require('superagent'), Promise);
    

module.exports = function notify(ctx, req, res) {
    
    const
        token = ctx.secrets.SLACK_TOKEN,
        read_opts = {limit: '100kb'},
        
        say = R.compose(
            slack.chat.postMessage,
            R.assoc('token', token),
            R.assoc('text', R.__, {channel: '#motion'})
        ),
        
        share = data => agent
            .post(`https://slack.com/api/files.upload`)
            .field('channels', '#motion')
            .field('token', token)
            .attach('file', data, 'snapshot.jpg')
            .end(),
        
        pending = [];
    
    
    if(ctx.query.motion) pending.push(say('Incoming'));
    if(ctx.query.image) pending.push(read(req, read_opts).then(share));
    
    return Promise.all(pending).then(function() {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('OK\n');
    });
    
}
