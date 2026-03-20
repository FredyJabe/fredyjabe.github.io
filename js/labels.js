function label(labelname) {
    var retval = "???";

    switch(navigator.language.substring(2))
    {
        case 'fr':
            switch(labelname)
            {
                case "welcomescreen": retval = "Cliquez pour entrer"; break;
            }
            break;
    }

    return retval;
}