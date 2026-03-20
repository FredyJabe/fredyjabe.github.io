function resizeIframe(obj) {
    obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
}

function openContent(url) {
    var f = document.getElementById('contentEmbed');
    var target;
    switch(url)
    {
        case 'blog':
            target = 'pages/blog.html';
            break;
        case 'blog2':
            target = 'pages/blog.html?listing=1';
        case 'jabejam':
            target = 'pages/jabejam.php';
            break;
        case 'toolbox':
            target = 'pages/tools/toolbox.html';
            break;
        case 'calendar':
            target = 'https://calendar.google.com/calendar/embed?src=rd4ng9go42bvu91jedsqbpg9ik%40group.calendar.google.com&ctz=America%2FToronto';
            break;
        default:
            target = 'pages/' + url + '.html';
    }

    fetch(target).then(function (response) {
        // The API call was successful!
        return response.text();
    }).then(function (html) {
        // This is the HTML from our response as a text string
        f.innerHTML = html;
    }).catch(function (err) {
        // There was an error
        console.warn('Something went wrong.', err);
    });
}

function init()
{
    openContent('welcome');

    var buttonWelcome = document.getElementById('welcome');
    buttonWelcome.onclick = function() {
        openContent('welcome');
    }
    var buttonBlog = document.getElementById('blog');
    buttonBlog.onclick = function() {
        openContent('blog');
    }
    var buttonProjects = document.getElementById('projects');
    buttonProjects.onclick = function() {
        openContent('projects');
    }
    var buttonLinks = document.getElementById('calendar');
    buttonLinks.onclick = function() {
        openContent('calendar');
    }
    var buttonLinks = document.getElementById('links');
    buttonLinks.onclick = function() {
        openContent('links');
    }
    var buttonJabejam = document.getElementById('jabejam');
    buttonJabejam.onclick = function() {
        openContent('jabejam');
    }

    var buttonToolbox = document.getElementById('tb');
    buttonToolbox.onclick = function() {
        openContent('toolbox');
    }
}