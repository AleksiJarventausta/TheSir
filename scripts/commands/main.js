"use strict";
/* IMPORT const commands = require('./scripts/commands/main.js');
/* MAIN replyCommands(message);
 */


/* TODO
 * embed / nicer output
 */
const commands = `
    poke @mention
    help
    ping
    niilo22
    meme
    pop {number}
    bap @mention
    `

exports.replyCommands = async (message) => {
    try {
        message.channel.send("Available commands: " + commands);
    }
    catch (error) {
        console.log(error)
    }

}
