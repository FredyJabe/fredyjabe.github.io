<!DOCTYPE HTML>
<HTML>
    <HEAD>
        <LINK rel="stylesheet" href="css/embeds.css">
        <LINK rel="stylesheet" href="css/jabejam.css">
        <LINK rel="stylesheet" href="css/mobile.css">

        <LINK rel="preconnect" href="https://fonts.googleapis.com">
        <LINK rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <LINK href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@500&display=swap" rel="stylesheet">

        <SCRIPT src="js/gotoPage.js"></SCRIPT>
    </HEAD>
    <BODY>
        <DIV>
            <IMG src="images/JabeJam.png">
            <H3>JabeJam, what is that?</H3>
            <P>The JabeJam is a tiny GameJam that I started because I wanted to try one and none were about to start at that time! So we choose a time frame, 3 themes and we start doing what we like, making games!</P>
            <P>It is a friendly event that promotes inclusion and creativity.</P>
            <P>The rules are pretty much like other gamejams, you have to make a game from scratch in 48 hours or less and follow the chosen themes.</P>
            <H3>How to participate</H3>
            <P>It's actually quite simple, just press on the button down here!</P>
            <DIV class="button" onclick="openInNewTab('https://jams.gamejolt.io/jabejam2');">Participate!</DIV>
            <H3>Old Jams with themes</H3>
            <DIV class="oldJamList">
<?php
    date_default_timezone_set("America/Toronto");

    $phpfiles = glob("./pages/oldJams/*.txt");
    $sortedFiles = [];

    if(count($phpfiles) > 0)
    {
        foreach($phpfiles as $file)
        {
            $sortedFiles[] = [filemtime($file), $file];
        }

        sort($sortedFiles);

        foreach($sortedFiles as $file)
        {
            $filename = basename($file[1], ".txt");
            $fn = fopen("./pages/oldJams/".$filename.".txt","r");

            echo "                <DIV class=\"oldJam\">\n";
            echo "                    <DIV class=\"jamId\">JabeJam ".urldecode($filename)."</DIV>\n";
            echo "                    <DIV class=\"jamThemes\">\n";
            echo "                        <DIV>".str_replace(array("\n", "\t", "\r"), '', fgets($fn))."</DIV>\n";
            echo "                        <DIV>".str_replace(array("\n", "\t", "\r"), '', fgets($fn))."</DIV>\n";
            echo "                        <DIV>".str_replace(array("\n", "\t", "\r"), '', fgets($fn))."</DIV>\n";
            echo "                    </DIV>\n";
            echo "                </DIV>\n";

            fclose($fn);
        }
    }
?>
            </DIV>
        </DIV>
    </BODY>
</HTML>