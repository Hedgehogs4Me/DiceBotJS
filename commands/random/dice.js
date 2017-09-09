const commando = require('discord.js-commando');

class DiceRoll extends commando.Command {
    constructor(client){
        
        super(client, {
            
            name: 'roll',
            group: 'random',
            memberName: '/',
            description: 'Roll'
            
        });

    }

    async run(message, args) {
        let prefix = "/";
        var roll = Math.floor(Math.random() * 6) + 1;
        message.reply(roll);


    }

}

module.exports = DiceRoll;