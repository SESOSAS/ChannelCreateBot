const {Client} = require("discord.js");
const bot = new Client();
const config = require("../config.json");
bot.on("message", message => {
    if(message.guild && !message.author.bot){
        if(message.content.startsWith(config.prefix+"create")){
            if(message.member.voice.channel){
                if(message.member.voice.channel.name == config.server.channel){
                    message.guild.channels.create(message.author.username + "'s Room", {type: "voice"})
                    .then(channel => {
                        let category = message.guild.channels.cache.find(c => c.name == config.server.category && c.type == "category");
                        if (!category) throw new Error("Category channel does not exist");
                        channel.setParent(category.id);
                        message.member.voice.setChannel(channel).then(message.reply("Created!")).catch(console.log("Channel has been created"));
                    }).catch(console.error);
                }
                else{
                    message.reply("Please make sure that you try to create a channel inside Join to Create!");
                }
            }else{
                message.reply("You need to be in a voice channel!");
            }
        }else{
            const channel = message.guild.channels.cache.find(c => c.name === message.author.username + "'s Room");
            if(!message.member.voice.channel){
                channel.delete();
                message.reply("Your channel has been deleted!");
            }
        }
    }
})
bot.login(config.token);