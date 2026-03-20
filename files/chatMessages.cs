using System;
using System.IO;
using System.Collections.Generic;

public class CPHInline
{
    public static string logFile = @"E:\Stream\Logs\commands.log";
    public static string logContent = "";

    public static string commandsFolder = @"E:\Stream\Commands";
    public static string soundsFolder = @"E:\Stream\Sounds";
    public static string gifsFolder = @"E:\Stream\Gifs";
    public static string dataFolder = @"E:\Stream\Data";

    private static bool canPlayPlaisir = true;
    private static bool canPlaySoundOrGif = true;

    private static int chanceRoulette = 6;

    private static string[] commands;
    private static string[] sounds;
    private static string[] gifs;

    public bool Execute()
    {
        try
        {
            string wholeMessage = args["rawInput"].ToString();
            if (wholeMessage.StartsWith("!"))
            {
                string cmd = wholeMessage.Split(' ')[0].Substring(1).ToLower();
                commands = Directory.GetFiles(commandsFolder);
                gifs = Directory.GetFiles(gifsFolder);

                var snds = new List<string>();
                snds.AddRange(Directory.GetFiles(soundsFolder));
                snds.AddRange(Directory.GetDirectories(soundsFolder));
                sounds = snds.ToArray();
                
                // Text commands
                addLog("Loading chat commands");
                for (var i = 0; i < commands.Length; i++)
                    commands[i] = commands[i].Split('\\')[3].Split('.')[0];
                
                // Sound commands
                addLog("Loading sound commands");
                for (var i = 0; i < sounds.Length; i++)
                    sounds[i] = sounds[i].Split('\\')[3].Split('.')[0];
                
                // Gif commands
                addLog("Loading sound commands");
                for (var i = 0; i < gifs.Length; i++)
                    gifs[i] = gifs[i].Split('\\')[3].Split('.')[0];

                addLog($"Loaded {commands.Length + sounds.Length} commands");
                
                // Checks if the command actually exists
                if (Array.IndexOf(commands, cmd) >= 0)
                {
                    addLog("Command used");
                    addLog($"  {cmd}");
                    readCommand($"{commandsFolder}\\{cmd}.txt", wholeMessage);
                }
                // Commandes sonores
                else if (Array.IndexOf(sounds, cmd) >= 0)
                {
                    addLog("Sound played");
                    addLog($"  {cmd}");
                    if (canPlaySoundOrGif)
                    {
                        canPlaySoundOrGif = false;
                        switch (cmd)
                        {
                            case "plaisir":
                                if (canPlayPlaisir)
                                {
                                    canPlayPlaisir = false;
                                    CPH.PlaySound($"{soundsFolder}\\{cmd}.ogg", 0.6F, true);
                                    canPlaySoundOrGif = true;
                                    CPH.Wait(300000);
                                    canPlayPlaisir = true;
                                }
                                else
                                    CPH.SendMessage("/me plaisir est en cooldown!");
                                break;
                            default:
                                if (Directory.Exists($"{soundsFolder}\\{cmd}"))
                                    CPH.PlaySoundFromFolder($"{soundsFolder}\\{cmd}", 1F, false, true);
                                else
                                {
                                    if (File.Exists($"{soundsFolder}\\{cmd}.ogg")) CPH.PlaySound($"{soundsFolder}\\{cmd}.ogg", 1F, true);
                                    if (File.Exists($"{soundsFolder}\\{cmd}.mp3")) CPH.PlaySound($"{soundsFolder}\\{cmd}.mp3", 1F, true);
                                }

                                break;
                        }

                        canPlaySoundOrGif = true;
                    }
                    else
                        CPH.SendMessage("/me un son est déjà en cours.");
                }
                else if (Array.IndexOf(gifs, cmd) >= 0)
                {
                    if (canPlaySoundOrGif)
                    {
                        canPlaySoundOrGif = false;
                        CPH.ObsSetBrowserSource("Component Overlay 2", "Gifs", $"{gifsFolder}\\{cmd}.webm");
                        CPH.ObsSetSourceVisibility("Component Overlay 2", "Gifs", true);
                        CPH.Wait(getVideoDuration($"{gifsFolder}\\{cmd}.webm"));
                        CPH.ObsSetSourceVisibility("Component Overlay 2", "Gifs", false);
                        canPlaySoundOrGif = true;
                    }
                }

                addLog("Command execution complete");
            }
        }
        catch (Exception e)
        {
            addLog("ERROR");
            addLog(e.ToString());
        }
        finally
        {
            using (StreamWriter writer = new StreamWriter(logFile, false))
            {
                writer.WriteLine(logContent);
            }
        }

        return true;
    }

    // Log une ligne
    public static void addLog(string t)
    {
        logContent += t + "\n";
    }

    // Methode pour lire et traiter les ficheirs de commandes
    private void readCommand(string cmdFile, string wholeText)
    {
        string output = "";
        bool hasOutput = true;
        string[] arg = wholeText.Split(' ');
        string toAdd = "";
        string sender = args["targetUser"].ToString();
        string[] lines = File.ReadAllLines(cmdFile);

        for (var l = 0; l < lines.Length; l++)
        {
            string line = lines[l];
            
            // Empêche le bot de répondre
            if (line.Contains("{noOutput}")) hasOutput = false;
            
            // Affiche le nom de la personne qui a fait la commande
            if (line.Contains("{sender}")) line = line.Replace("{sender}", sender);
            
            // Commande custom de roulette russe
            if (line.Contains("{customRoulette}")) commandCustomRoulette(sender);
            
            // Commande custom pour changer le label en haut du stream
            if (line.Contains("{changeText}")) commandChangeText(wholeText.Substring(arg[0].Length));
            
            // Commande custom pour prendre des notes
            if (line.Contains("{note}")) commandTakeNote(sender, wholeText.Substring(arg[0].Length));
            
            // Affiche la liste des commandes disponibles
            if (line.Contains("{cmds}"))
            {
                string cmdList = "";
                foreach (string c in commands)
                    cmdList += $"!{c} ";
                line = line.Replace("{cmds}", cmdList);
            }

            // Affiche la liste des SFX disponible
            if (line.Contains("{sounds}"))
            {
                string sndsList = "";
                foreach (string s in sounds)
                    sndsList += "!" + s.Split('.')[0] + " ";
                line = line.Replace("{sounds}", sndsList);
            }

            // Affiche la liste des gifs disponible
            if (line.Contains("{gifs}"))
            {
                string gifsList = "";
                foreach (string g in gifs)
                    gifsList += "!" + g.Split('.')[0] + " ";
                line = line.Replace("{gifs}", gifsList);
            }

            // Change les arguments dynamiquement
            for (var i = 1; i <= arg.Length; i++)
            {
                if (line.Contains("{" + i.ToString() + "}"))
                    line = line.Replace("{" + i.ToString() + "}", arg[i].Replace("@", ""));
            }

            // Wait un nombre de milisecondes
            if (line.Contains("{w}"))
            {
                line = line.Replace("{w}", "");
                CPH.Wait(Int32.Parse(line));
                CPH.SendMessage(lines[l + 1]);
                line = "";
                hasOutput = false;
            }

            output += line;
        }

        if (hasOutput)
            CPH.SendMessage(output);
    }

    // Commande custom : Roulette
    private void commandCustomRoulette(string sender)
    {
        CPH.SendMessage($"/me pointe l'arme vers {sender} et appuie sur la détente...");
        CPH.Wait(1000);
        if (CPH.Between(1, chanceRoulette) == 1)
        {
            chanceRoulette = 6;
            CPH.SendMessage("/me tire et TO pour 69 secondes!");
            CPH.SendMessage($"/timeout {sender} 69 Roulette Russe");
        }
        else
        {
            chanceRoulette--;
            CPH.SendMessage("/me tire à blanc...");
        }
    }

    // Commande text
    private void commandChangeText(string txt)
    {
        var filePath = dataFolder + "\\label.txt";
        using (StreamWriter writer = new StreamWriter(filePath))
            writer.WriteLine(txt);
    }

    // Commande text
    private void commandTakeNote(string sender, string txt)
    {
        var filePath = dataFolder + "\\notes.txt";
        using (StreamWriter writer = new StreamWriter(filePath, true))
            writer.WriteLine(sender + ": " + txt);
    }

    // Retourne la durée en millisecondes d'un video
    private int getVideoDuration(string path)
    {
        var tfile = TagLib.File.Create(path);
        TimeSpan duration = tfile.Properties.Duration;
        return duration.Milliseconds + (duration.Seconds * 1000);
    }
}