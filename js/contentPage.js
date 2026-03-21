function resizeIframe(obj) {
    obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
}

function openContent(url) {
    var f = document.getElementById('contentEmbed');
    var target;
    var isBlogPostPage = /^posts\//i.test(url);
    switch(url)
    {
        case 'blog':
            target = 'pages/blog.html';
            break;
        case 'blog2':
            target = 'pages/blog.html?listing=1';
            break;
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

        if (isBlogPostPage) {
            var autoBackButton = document.createElement('div');
            autoBackButton.className = 'button';
            autoBackButton.setAttribute('label-index', 'blog.backToList');
            autoBackButton.textContent = typeof t === 'function' ? t('blog.backToList', 'Back to blog list') : 'Back to blog list';
            autoBackButton.onclick = function () {
                openContent('blog2');
            };
            f.insertBefore(autoBackButton, f.firstChild);
        }

        // Scripts inserted via innerHTML are inert, so re-create them to execute page logic.
        var scripts = f.querySelectorAll('script');
        scripts.forEach(function (oldScript) {
            var newScript = document.createElement('script');

            Array.from(oldScript.attributes).forEach(function (attribute) {
                newScript.setAttribute(attribute.name, attribute.value);
            });

            newScript.text = oldScript.text;
            oldScript.parentNode.replaceChild(newScript, oldScript);
        });

        if (typeof applyTranslations === 'function') {
            applyTranslations(f);
        }
    }).catch(function (err) {
        // There was an error
        console.warn('Something went wrong.', err);
    });
}

function init()
{
    function updateLanguageButtonLabel() {
        var buttonLang = document.getElementById('langSwitch');
        if (!buttonLang || typeof getCurrentLanguage !== 'function') {
            return;
        }

        buttonLang.textContent = getCurrentLanguage().toUpperCase();
    }

    openContent('welcome');

    if (typeof applyTranslations === 'function') {
        applyTranslations(document);
    }

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
    var buttonLinks = document.getElementById('links');
    buttonLinks.onclick = function() {
        openContent('links');
    }

    var buttonLang = document.getElementById('langSwitch');
    if (buttonLang && typeof setLanguage === 'function' && typeof getCurrentLanguage === 'function') {
        updateLanguageButtonLabel();
        buttonLang.onclick = function () {
            var nextLanguage = getCurrentLanguage() === 'fr' ? 'en' : 'fr';
            setLanguage(nextLanguage).then(function () {
                updateLanguageButtonLabel();
            });
        };
    }
    var buttonJabejam = document.getElementById('jabejam');
    buttonJabejam.onclick = function() {
        openContent('jabejam');
    }

    var buttonToolbox = document.getElementById('tb');
    buttonToolbox.onclick = function() {
        openContent('toolbox');
    }

    document.addEventListener('languagechanged', function () {
        updateLanguageButtonLabel();
    });
}