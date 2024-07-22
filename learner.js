// Load the book from disk
function loadBook(filename, displayname) {
    let currentBook = "";
    let url = "Books/" + filename;

    // Reset the UI
    document.getElementById("filename").innerText = displayname;
    document.getElementById("searchStat").innerText = "";
    document.getElementById("keyword").value = "";

    // Create server request to load our book
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.send();

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            currentBook = xhr.responseText;

            getDocStats(currentBook);

            //Remove line break and carriage returns and replace
            currentBook = currentBook.replace(/(?:\r\n|\r|\n)/g, '<br>');
            document.getElementById("fileContent").innerHTML = currentBook;
            var con = document.getElementById("fileContent");
            con.scrollTop = 0;
        }
    };
}

function getDocStats(fileContent) {
    var docLength = document.getElementById("docLength");
    var wordCount = document.getElementById("wordCount");
    var charCount = document.getElementById("charCount");

    let txt = fileContent.toLowerCase();
    let wordArray = txt.match(/\b\S+\b/g);
    let wordDictionary = {};
    let uncommonWords = [];
    uncommonWords = sortCommonWords(wordArray);

    for (let word of uncommonWords) {
        let wordValue = uncommonWords[word];
        if (wordDictionary[wordValue]>0) {
            wordDictionary[wordValue] += 1;
        } else {
            wordDictionary[wordValue] = 1;
        }
    }

    let wordList = sortProperties(wordDictionary);

    // top 5
    var topWords = wordList.slice(0, 6);
    var lastWords = wordList.slice(-6,wordList.length);

    ulTemplate(topWords, document.getElementById("mostUsed"));
    ulTemplate(lastWords, document.getElementById("leastUsed"));

    // Display document stats
    docLength.innerText = "Document Length: " + txt.length;
    wordCount.innerText = "Word Count: " + wordArray.length;
    //charCount.innerText = "Character Count: " + fileContent.replace(/\s/g, "").length;
}

function ulTemplate(items, element) {
    let rowTemplate = document.getElementById("template-ui-items");
    let templateHTML = rowTemplate.innerHTML;
    let resultHtml = "";
    for (let i = 0; i < items.length; i++) {
        resultHtml += templateHTML.replace("{{val}}", items[i][0] + ": " + items[i][1] + " times");
    }
    element.innerHTML = resultHtml;
}

// Generic sort
function sortProperties(obj) {
    let rtnArray = Object.entries(obj);
    rtnArray.sort(function (first, second) {
        return second[1] - first[1];
    });
    return rtnArray;
}

function sortCommonWords(wordArrays) {
    let commonWords = stopWords();
    let commonObj = {};
    let uncommonArr = [];

    for (let i = 0; i < commonWords.length; i++) {
        commonObj[commonWords[i].trim()] = true;
    }

    for (let i = 0; i < wordArrays.length; i++) {
        let word = wordArrays[i].trim().toLowerCase();
        if (!commonObj[word]) {
            uncommonArr.push(word);
        }
    }
    return uncommonArr;
}

function stopWords() {
    return ["i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is"];
}
