/* Dependencies */

const FileSystem = require("fs");
const Discord = require("discord.js");
const Auth = JSON.parse(FileSystem.readFileSync("./Auth.JSON"));

/* Constructors */

const Bot = new Discord.Client();

/* Constants */

const Prefix = "|";

/* Initialization */

PluginsFolder = FileSystem.readdirSync("./Plugins/");
Plugins = {};

for (I = 0; I < PluginsFolder.length; I++) {
	if (FileSystem.statSync("./Plugins/" + PluginsFolder[I]).isDirectory()) return;
	Plugins[PluginsFolder[I]] = require("./Plugins/" + PluginsFolder[I]);
}

PluginList = Object.keys(Plugins);
PluginCommands = {};

Handlers = {
    "Events": {},
    "Commands": {}
};

for (N = 0; N < Object.keys(Plugins).length; N++) {
    PluginCommands[PluginList[N]] = new Discord.RichEmbed()
        .setTitle(Object.keys(Plugins)[N])
        .setColor(0x1493FF);
    };
    CommandList = Object.keys(Plugins[PluginList[N]].Handlers.Commands);
	for (C = 0; C < Object.keys(Plugins[PluginList[N]].Handlers.Commands).length; C++) {
		Handlers.Commands[CommandList[C]] = Plugins[PluginList[N]].Handlers.Commands[CommandList[C]];
		HelpTopic = {
			"Title": "Unnamed",
			"Syntax": "No Syntax",
			"Description": "No Description"
		};
		if (Handlers.Commands[CommandList[C]].HelpTopic["Title"]) {
			HelpTopic["Title"] = Handlers.Commands[CommandList[C]].HelpTopic["Title"];
		}
		if (Handlers.Commands[CommandList[C]].HelpTopic["Syntax"]) {
			HelpTopic["Syntax"] = Handlers.Commands[CommandList[C]].HelpTopic["Syntax"];
		}
		if (Handlers.Commands[CommandList[C]].HelpTopic["Description"]) {
			HelpTopic["Description"] = Handlers.Commands[CommandList[C]].HelpTopic["Description"];
		}
		PluginCommands[PluginList[N]]
            .addField(Prefix + HelpTopic["Title"], "Syntax : ``" + Prefix + HelpTopic["Syntax"] + "``\nSynopsis : ``" + HelpTopic["Description"] + "``", true);
	}
}

/* Events */

Bot.on("ready", function () {
    console.log("Bot Ready and Logged In as " + Bot.user.username + " - " + Bot.user.id);
    Bot.user.setPresence({
        "status": "dnd",
		"game": {
            "name": "Being ReWritten",
            "type": 1,
            "url": "https://www.twitch.tv/x3f200c"
        }
    });
});

Bot.on("message", function (Message) {
    Arguments = Message.content.substring(Prefix.length).split(" ");
    Command = Arguments[0];


    if (!Message.content.startsWith(Prefix)) return;
    switch(Command) {
        case "help":
            for (Pl = 0; Pl < PluginList.length; Pl++) {
                Content = "";
                if (Pl = 0) Content = "Here is my Help Page";
                Message.channel.send({Content, {"embed": PluginCommands[PluginList[Pl]]});
            }
            break;
        default:
            for (C = 0; C < Object.keys(Handlers.Commands).length; C++) {
                if (Object.keys(Handlers.Commands)[C] == Command) {
                    if (!Message.member.hasPermission(Handlers.Commands[Command].TestPermission)) return Message.channel.send("I'm Sorry but you do not have Permission to do that. ");
                    Handlers.Commands[Command].Exec(Bot, Prefix, Command, Arguments, Message);
                }
            }
            break;
    }
});

Bot.login(Auth["Token"]);
