"use strict";


exports.poke = async (message) => {
    try {
        const user = message.mentions.users.first();
        if (user) {
            user.send("poke :3");
            message.reply(`HER�TYS ${user.tag}, senkin v�tys!`);
        }
    }
    catch (error) {
        console.log(error)
    }

}
