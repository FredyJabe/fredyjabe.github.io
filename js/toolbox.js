const input = document.querySelector('input');
const documentTabs = document.getElementsByClassName('tab');
const heightLimit = 400; /* Maximum height: 500px */

function updateHeight()
{
    let textarea = document.getElementById("bodyText");
    textarea.style.height = ""; /* Reset the height*/
    textarea.style.height = Math.min(textarea.scrollHeight, heightLimit) + "px";
}

function openTab(name)
{
    let y = document.getElementById(name);

    for (const t of documentTabs)
        { t.style.display = 'none'; }

    y.style.display = 'block';
}

function previewBlogPost()
{
    var p = document.getElementById('blogpostPreview');
    var t = document.getElementById('bodyText');

    p.innerHTML = t.value;
}