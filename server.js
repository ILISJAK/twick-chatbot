require('dotenv').config();

const tmi = require('tmi.js');

// const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)=(.*)?/);

const commands = {
    echo: {
        response: (tags, args) => `@${tags.username}, you said: "${args.join(' ')}"`
    },
    website: {
        response: 'https://www.twitch.tv/twickchatbot'
    },
    upvote: {
        response: (tags) => `User ${tags.username} was just upvoted`
    }
}

const client = new tmi.Client({
    connection: { reconnect: true },
    channels: ['twickchatbot'],
    identity: {
        username: process.env.TWITCH_BOT_USERNAME,
        password: process.env.TWITCH_OAUTH_TOKEN
    }
});

client.connect();

client.on('message', (channel, tags, message, self) => {
    const isNotBot = tags.username.toLocaleLowerCase() !== process.env.TWITCH_BOT_USERNAME;
    if (!isNotBot) return;

    const args = message.slice(1).split(' ');
    const command = args.shift().toLowerCase();

    if (commands.hasOwnProperty(command)) {
        const cmd = commands[command];

        if (typeof cmd.response === 'function') {
            client.say(channel, cmd.response(tags, args));
        } else {
            client.say(channel, cmd.response);
        }
    }

    // echo each chat message
    // if (isNotBot) {
    //     client.say(channel, `Message "${message}" was sent by ${tags.username}`);
    // }
    console.log(`${tags['display-name']}: ${message}`);
});