const {Client} = require("discord.js");
const bot = new Client();
const config = require("../config.json");
bot.on("message", message => {
    setInterval(function() {
        try{
            const channel = message.guild.channels.cache.find(c => c.name === message.author.username + "'s Room");
            if(!message.member.voice.channel){
                channel.delete();
                message.author.send("Your channel has been deleted!");
            }
            if(message.member.voice.channel){
                if(message.member.voice.channel.name == config.server.channel){
                    if(message.guild.channels.cache.find(ch => ch.name === message.author.username + "'s Room")){
                        channel.delete();
                        message.author.send("Your channel has been deleted!\nMake sure that your old channel has been deleted before you create a new one!");
                    }
                    else{
                        message.guild.channels.create(message.author.username + "'s Room", {type: "voice"})
                        .then(channel => {
                            let category = message.guild.channels.cache.find(c => c.name == config.server.category && c.type == "category");
                            if (!category) throw new Error("Category channel does not exist");
                            channel.setParent(category.id);
                            message.member.voice.setChannel(channel).catch(console.log(message.member.user.tag + " Channel has been created!"));
                        }).catch(console.error);
                    }
                }
                else if(message.member.voice.channel.name == message.author.username + "'s Room"){
                    return;
                }
                else {
                    channel.delete();
                    message.author.send("Your channel has been deleted!");
                }
            }
        }
        catch{

        }
    }, 1000)
});
bot.login(config.token);