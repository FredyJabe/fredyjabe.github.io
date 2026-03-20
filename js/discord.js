function discordNewMessage(target, message) 
{
    var webhook = "https://discord.com/api/webhooks/941371998758653962/VdnAtfSJo8zkdt7916xS50mgt1oqr_gP0mcxAT0_iXPp7mlxO4mLzZl-0TSIDuwh5B9S";

    message = "\n" + message;
    
    switch(target)
    {
        case "News": 
            discordPostMessage(webhook + "?thread_id=941376519148802129", message);
            discordUpdateNews();
            break;
        case "Horaire":
            discordPostMessage(webhook + "?thread_id=941376519148802129", "**HORAIRE**\n" + message);
            discordUpdateHoraire();
            break;
        default:
            discordPostMessage(webhook, message);
    }
}

function discordPostMessage(url, msg) 
{
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        "content": msg,
        "name":"La PouTeam",
        "avatar_url": "https://www.PouTeam.ca/team/fredyjabe/images/discordBotAvatar.png",
    }));
}

function discordUpdateNews() 
{
    var webhook = "https://discord.com/api/webhooks/941371998758653962/VdnAtfSJo8zkdt7916xS50mgt1oqr_gP0mcxAT0_iXPp7mlxO4mLzZl-0TSIDuwh5B9S";
    var thread = "";
    var messageID = "959160074994089984";

    var dateActuelle = new Date().toLocaleString();

    var xhr = new XMLHttpRequest();
    xhr.open("PATCH", webhook + "/messages/" + messageID + thread, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
    "name": "La PouTeam",
    "content": "\u200B",
    "avatar_url": "https://www.PouTeam.ca/team/fredyjabe/images/discordBotAvatar.png",
    "tts": false,
    "embeds": [
    {
        "type": "rich",
        "title": "Chez vous",
        "description": "Ici tu va t'sentir comme chez vous, c'est promis!\n\nFeel free d'explorer les divers Threads qu'on a pour discuter, sinon tu peux aussi cliquer sur les bouttons en bas pour accéder à mes liens sociaux et/ou le merch store de la PouTeam!!",
        "color": 0x0048ff,
        "fields": [
        {
            "name": "Les Threads",
            "value": "[News](https://discord.com/channels/684608690506170386/941376519148802129) (" + dateActuelle + ")\n[Général](https://discord.com/channels/684608690506170386/941021362120704030)\n[Suggestions](https://discord.com/channels/684608690506170386/941022097822597212)\n[Up to 1 000 000](https://discord.com/channels/684608690506170386/941021656015589437)"
        }]
    }]
    }));
}

function discordUpdateHoraire() 
{
    var webhook = "https://discord.com/api/webhooks/941371998758653962/VdnAtfSJo8zkdt7916xS50mgt1oqr_gP0mcxAT0_iXPp7mlxO4mLzZl-0TSIDuwh5B9S";
    var thread = "";
    var messageID = "960537065173418054";

    var message = "\n" + document.getElementById('msg').value;
    var dateActuelle = new Date().toLocaleString();

    var xhr = new XMLHttpRequest();
    xhr.open("PATCH", webhook + "/messages/" + messageID + thread, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        "content": "\u200B",
        "name":"La PouTeam",
        "avatar_url": "https://www.PouTeam.ca/team/fredyjabe/images/discordBotAvatar.png",
        "content": "",
        "tts": false,
        "embeds": [
            {
            "type": "rich",
            "title": "HORAIRE",
            "description": message,
            "color": 0x00FFFF,
            "image": {
                "url": `https://www.PouTeam.ca/team/fredyjabe/images/horaire.png`,
                "height": 0,
                "width": 0
            }
            }
        ]
    }));
}