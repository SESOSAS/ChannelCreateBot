const {Client, MessageEmbed} = require("discord.js");
const client = new Client();
const fs = require("fs");
const gb = JSON.parse(fs.readFileSync("../src/database/guild.json"), "utf8");
const ub = JSON.parse(fs.readFileSync("../src/database/user.json"), "utf8");

const {token, prefix} = require("../config.json");

client.login(token);

client.on("ready", () => {
    console.log("Online");
})

client.on("message", async(message) => {

    if(message.author.bot) return;
    if(message.channel.type != "dm"){

        const embed = new MessageEmbed();
        const ch = message.channel;
        const er = "ERROR";
        const nf = "There is no further argument!";
        const r = "RED";
        const y = "YELLOW";
        const g = "GREEN";

        if(!gb[message.guild.id]) gb[message.guild.id] = {
            "use": false,
            "categoryName": null,
            "channelID": null
        }

        const gbase = gb[message.guild.id];

        if(!ub[message.author.id]) ub[message.author.id] = {
            "channelID": null
        }

        if(message.content.startsWith(prefix)){
            const command = message.content.slice(prefix.length).split(" ");
            if(command[0] == "settings"){
                if(command[1] != null){
                    if(command[1] == "channel"){
                        if(command[2] != null){
                            if(command[2] == "change"){
                                if(command[3] != null){

                                }
                                else{

                                }
                            }
                            else{

                            }
                        }
                        else{

                        }
                    }
                    else{

                    }
                }
            }
            else if(command[0] == "help"){
                if(command[1] != null){
                    embed.setAuthor(message.author.tag, message.author.avatarURL(URL));
                    embed.addField(er, nf);
                    embed.setColor(r);
                    embed.setFooter(message.guild.name, message.guild.iconURL(URL));
                    ch.send(embed);
                }
                else{
                    embed.setAuthor(message.author.tag, message.author.avatarURL(URL));
                    embed.addField("Commands", [prefix+"settings", prefix+"help"]);
                    embed.setColor(g);
                    embed.setFooter(message.guild.name, message.guild.iconURL(URL));
                    ch.send(embed);
                }
            }
            else{
                embed.setAuthor(message.author.tag, message.author.avatarURL(URL));
                embed.addField(er, "This Command doesnt exists!");
                embed.setColor(r);
                embed.setFooter(message.guild.name, message.guild.iconURL(URL));
                ch.send(embed);
            }
        }
    }
});

client.on("voiceStateUpdate", (oldstate, newstate) => {
    if (oldState.channel === null && newState.channel !== null){
        const gbase = gb[newstate.guild.id];
        const ubase = ub[newstate.member.user.id];
        if(gbase.use){
            if(newstate.channelID == gbase.channelID){
                const guild = client.guilds.cache.get(newstate.guild.id);
                guild.channels.create(newstate.member.user.username + "s Room", {type: "voice"}).then(channel => {
                    let category = guild.channels.cache.find(c => c.name == gbase.categoryName && c.type == "category");
                
                    if (!category) throw new Error("Category channel does not exist");
                    channel.setParent(category.id);
                    newstate.member.voice.setChannel(channel);
                    ubase.channelID = channel.id;
                  }).catch(console.error);
            }
        }
    }
    else{
        if(ubase.channelID != null){
            const ubase = ub[newstate.member.user.id];
            const guild = client.guilds.cache.get(newstate.guild.id);
            guild.channels.cache.get(ubase.channelID).delete("The User has left the channel!");
            ubase.channelID = null;
        }
    }
})

function suc(text){
    return "Successfully changed " + text; 
}