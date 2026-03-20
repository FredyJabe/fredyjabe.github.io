<!DOCTYPE HTML>
<HTML>
    <HEAD>
        <LINK rel="stylesheet" href="css/embeds.css">
        <LINK rel="stylesheet" href="css/blog.css">
        <LINK rel="stylesheet" href="css/mobile.css">

        <LINK rel="preconnect" href="https://fonts.googleapis.com">
        <LINK rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <LINK href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@500&display=swap" rel="stylesheet">

        <SCRIPT src="js/gotoPage.js"></SCRIPT>
        <SCRIPT src="js/discord.js"></SCRIPT>
    </HEAD>
    <BODY>
        <H1 id="title">Le Blog</H1>
<?php
    date_default_timezone_set("America/Toronto");

    $title = "";
    $content = "";
    $listing = false;

    if (isset($_POST["title"])) { $title = $_POST["title"]; }
    if (isset($_POST["content"])) { $content = $_POST["content"]; }

    if (isset($_GET["listing"])) { $listing = true; }
    
    if($title != "" && $content != "")
    {
        if (!file_exists(".\\posts\\".urlencode($title).".html"))
        {
            $newPostContent = "<!DOCTYPE HTML>\n";
            $newPostContent .= "<HTML>\n";
            $newPostContent .= "    <HEAD>\n";
            $newPostContent .= "        <META charset=\"UTF-8\">\n";
            $newPostContent .= "        <LINK rel=\"stylesheet\" href=\"css/sitewide.css\">\n";
            $newPostContent .= "        <LINK rel=\"stylesheet\" href=\"css/embeds.css\">\n";
            $newPostContent .= "        <LINK rel=\"stylesheet\" href=\"css/mobile.css\">\n";
            $newPostContent .= "        <LINK rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n";
            $newPostContent .= "        <LINK rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n";
            $newPostContent .= "        <LINK href=\"https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@500&display=swap\" rel=\"stylesheet\">\n";
            $newPostContent .= "        <SCRIPT src=\"js/gotoPage.js\"></SCRIPT>";
            $newPostContent .= "    </HEAD>\n";
            $newPostContent .= "    <BODY>\n";
            $newPostContent .= "        <DIV class=\"button\" onclick=\"openContent('blog');\">Retour</DIV>\n";
            $newPostContent .= "        <H1>".$title."</H1>\n";
            $newPostContent .= "        <P>".$content."</P>\n";
            $newPostContent .= "    <BODY>\n";
            $newPostContent .= "    </BODY>\n";
            $newPostContent .= "</HTML>";

            file_put_contents(".\\posts\\".urlencode($title).".html", $newPostContent);

            $postUrl = "https://www.FredyJabe/blog/".urlencode($title).".html";
            $updateMessage  = "**NOUVEAU BLOGPOST**\\n";
            $updateMessage .= "Le Frèdé vient de poster un nouveau message sur son blog! Va voir ce qui en est au ".$postUrl;
            echo "<SCRIPT>discordNewMessage('News','".$updateMessage."');</SCRIPT>";
        }
    }
?>
<?php
    date_default_timezone_set("America/Toronto");

    $phpfiles = glob(".\\posts\\*.html");
    $sortedFiles = [];

    if ($listing == false) echo "            <DIV class=\"blogBody\">\n";
    else echo "            <DIV>\n";

    if(count($phpfiles) > 0)
    {
        foreach($phpfiles as $file)
        {
            $sortedFiles[] = [filemtime($file), $file];
        }

        sort($sortedFiles);
        $count = 0;

        foreach($sortedFiles as $file)
        {
            $filename = basename($file[1], ".html");
            $date = date("Y/m/d H:i",$file[0]);

            if ($listing == false)
            {
                $preview = "";

                echo "                <DIV class=\"card\" onclick=\"openContent('posts/".urlencode($filename)."');\">\n";
                echo "                    <DIV><H2>".urldecode($filename)."</H2></DIV>\n";
                echo "                    <DIV>".$date."</DIV>\n";
                echo "                    <DIV>".$preview."</DIV>\n";
                echo "                </DIV>\n";

                if ($count >= 8)
                {
                    echo "            </DIV>\n";
                    echo "<DIV class=\"button\" onclick=\"openContent('blog2');\">List all posts";
                    exit;
                }
                else $count ++;
            }
            else
            {
                echo "                <DIV class=\"left button\" onclick=\"goToPage('posts/".urlencode($filename)."');\">[".$date."]  ".urldecode($filename)."</DIV>\n";
            }
        }
    }
    else
    {
        echo "                <DIV>\n";
        echo "                    <DIV><H2>Nothing has been posted yet.</H2></DIV>\n";
        echo "                </DIV>\n";
    }
?>
        </DIV>
    </BODY>
</HTML>