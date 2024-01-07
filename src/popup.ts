document.getElementById('selectTableButton')!.addEventListener('click', function() {
    console.log("clicked button")
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id ?? 0, {action: 'startTableSelection'});
    });
});

