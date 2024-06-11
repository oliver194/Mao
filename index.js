const { REST } = require("@discordjs/rest");
const { Client, Collection, GatewayIntentBits, EmbedBuilder, ActivityType } = require("discord.js");
const { token } = require('./config.json');
const { Player } = require('discord-player');
const { version } = require('./package.json');

const fs = require("fs");
const path = require('node:path');

// our handlers
const { loadCommands } = require("./handler/slashCommands");
const { loadEvents } = require("./handler/events");
const { deployCommands } = require("./handler/deployCommands");

const client = new Client({ intents: 14023 });
client.commands = new Collection();

const rest = new REST({ version: "10" }).setToken(token);


// load commands
loadCommands(client);
loadEvents(client);
deployCommands(client);

async function audio(player){
    await player.extractors.loadDefault((ext) => ext == 'YouTubeExtractor');
}

// Audio
const player = new Player(client, {
    skipFFmpeg: false 
});
audio(player);

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
    //client.user.setPresence({ activities: [{ name: 'Brick Eating Simulator 2024' }] });
    client.user.setActivity('Karma by Jojo Siwa', { type: ActivityType.Listening });

    const channel = client.channels.cache.get('1231228286148018321');
    if (channel) {
        channel.send(`# Welcome to Mao Zedong v${version}`);
    } else {
        console.error('Could not find the specified channel.');
    }

});

player.events.on('playerStart', (queue, track) => {
    // we will later define queue.metadata object while creating the queue
    queue.metadata.channel.send(`Started playing **${track.title}**!`);

});

// discord-player debug
//player.events.on('debug', (queue, message) => console.log(`[DEBUG ${queue.guild.id}] ${message}`));

client.login(token);