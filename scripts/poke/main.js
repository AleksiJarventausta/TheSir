"use strict";

/* TODO 
 * encode message for ��kk�set
 * get nickname for guild 
 */

exports.poke = async (message) => {
    try {
        const user = message.mentions.users.first();
        if (user) {
            user.send("poke :3");
            message.reply(`HER�TYS ${user.username}, senkin v�tys!`);
        }
    }
    catch (error) {
        console.log(error)
    }

}
