var I18N_DEFAULT_LANGUAGE = "en";
var I18N_SUPPORTED_LANGUAGES = ["en", "fr"];
var I18N_STORAGE_KEY = "siteLanguage";

var i18nCurrentLanguage = I18N_DEFAULT_LANGUAGE;
var i18nDictionary = {};
var i18nEnglishDictionary = {};
var i18nInitPromise = null;

function normalizeLanguage(language) {
    if (typeof language !== "string" || language.length === 0) {
        return I18N_DEFAULT_LANGUAGE;
    }

    var normalized = language.toLowerCase().slice(0, 2);
    if (I18N_SUPPORTED_LANGUAGES.indexOf(normalized) === -1) {
        return I18N_DEFAULT_LANGUAGE;
    }

    return normalized;
}

function resolveTranslationKey(key, dictionary) {
    return key.split(".").reduce(function (current, segment) {
        if (!current || typeof current !== "object") {
            return undefined;
        }

        return current[segment];
    }, dictionary);
}

function getLanguageFromStorageOrBrowser() {
    var storedLanguage = localStorage.getItem(I18N_STORAGE_KEY);
    if (storedLanguage) {
        return normalizeLanguage(storedLanguage);
    }

    return normalizeLanguage(navigator.language || I18N_DEFAULT_LANGUAGE);
}

async function loadLanguageDictionary(language) {
    var targetLanguage = normalizeLanguage(language);
    var dictionaryPath = "lang/" + targetLanguage + ".json";
    var response = await fetch(dictionaryPath, { cache: "no-cache" });

    if (!response.ok) {
        throw new Error("Failed to load language file " + dictionaryPath + " (" + response.status + ")");
    }

    i18nDictionary = await response.json();
    i18nCurrentLanguage = targetLanguage;
    document.documentElement.lang = targetLanguage;
    localStorage.setItem(I18N_STORAGE_KEY, targetLanguage);
}

async function ensureEnglishDictionaryLoaded() {
    if (Object.keys(i18nEnglishDictionary).length > 0) {
        return;
    }

    var response = await fetch("lang/" + I18N_DEFAULT_LANGUAGE + ".json", { cache: "no-cache" });
    if (!response.ok) {
        throw new Error("Failed to load fallback language file lang/" + I18N_DEFAULT_LANGUAGE + ".json (" + response.status + ")");
    }

    i18nEnglishDictionary = await response.json();
}

function t(key, fallback) {
    var value = resolveTranslationKey(key, i18nDictionary);
    if (typeof value === "string") {
        return value;
    }

    var englishValue = resolveTranslationKey(key, i18nEnglishDictionary);
    if (typeof englishValue === "string") {
        return englishValue;
    }

    if (typeof fallback === "string") {
        return fallback;
    }

    return key;
}

function applyTranslations(rootElement) {
    var root = rootElement || document;
    var nodes = root.querySelectorAll("[label-index]");

    nodes.forEach(function (node) {
        var key = node.getAttribute("label-index");
        node.textContent = t(key, node.textContent);
    });
}

async function setLanguage(language) {
    var targetLanguage = normalizeLanguage(language);

    await ensureEnglishDictionaryLoaded();

    try {
        await loadLanguageDictionary(targetLanguage);
    } catch (error) {
        if (targetLanguage !== I18N_DEFAULT_LANGUAGE) {
            await loadLanguageDictionary(I18N_DEFAULT_LANGUAGE);
        } else {
            throw error;
        }
    }

    applyTranslations(document);
    document.dispatchEvent(new CustomEvent("languagechanged", {
        detail: { language: i18nCurrentLanguage }
    }));
}

function getCurrentLanguage() {
    return i18nCurrentLanguage;
}

async function initI18n() {
    if (i18nInitPromise) {
        return i18nInitPromise;
    }

    i18nInitPromise = ensureEnglishDictionaryLoaded().then(function () {
        return setLanguage(getLanguageFromStorageOrBrowser());
    }).catch(function () {
        return setLanguage(I18N_DEFAULT_LANGUAGE);
    });

    return i18nInitPromise;
}

function label(labelname) {
    return t(labelname, "???");
}