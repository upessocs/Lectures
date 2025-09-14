load(["./defaults.js", "./header.js", "./script.js", "./footer.js"])


// loaddefaults()



setTimeout(() => {
    for (i = 0; i < 100; i++) {
        setTimeout(() => {
            var x = cssvar("--loaded");
            cssvar("--loaded", i)
        }, 100)
    }
    document.getElementById("preloader").style.opacity = 0;
    setTimeout(() => {
        document.getElementById("preloader").style.zIndex = -1000;
        document.getElementById("preloader").style.display = 'none';
    }, 1000)
}, 2000)
