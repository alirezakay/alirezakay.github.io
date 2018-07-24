/**
 * Created by ALIREZA on 8/20/2017.
 */

$(function () {



    ///////////////////////////////////////////////////////////
    //refresh();

    $("a").on("click", function (event) {
        var hash = this.hash;

        if (hash !== "") {
            if (hash != "#"){
                var scroll = $(hash).offset().top ;

                event.preventDefault();
                $('body,html').animate(
                    {scrollTop: (scroll)},
                    900,
                    function () {
                        window.location.hash = hash;
                    }
                );
            }
        }

    });

	refresh();
	setTimeout(	setProfileTopMargin, 500);

});


function setTabBtnsToCenter() {
    var tabBtnsDistToSides;
    var tabBtns = document.getElementsByClassName("tablinks");
    var distSum = 0;
    var i;

    for(i=0; i<tabBtns.length; i++){
        tabBtns[i].style.position = "relative";
        distSum += tabBtns[i].clientWidth;
    }
    tabBtnsDistToSides = ($(".tab").width() - distSum )/ 2;
    for(i=0; i<tabBtns.length; i++){
        tabBtns[i].style.left = tabBtnsDistToSides.toString()+"px";
    }
}

function openTab(evt, tabItem) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabItem).style.display = "block";

    evt.currentTarget.className += " active";

    //////scrolling to the current tab
    var scroll = $("#"+tabItem.toString()).offset().top ;

    $('body,html').animate(
        {scrollTop: (scroll)},
        1000,
        function () {
            window.location.hash = "#"+tabItem.toString();
        }
    );


    //set the particle background height dynamically
    setBackgroundParticleHeight(1000);
}

function setBackgroundParticleHeight(time) {
    var tabText = $(".tab .active").text().toString();
    if(tabText == ""){
        return;
    }
    if (tabText.localeCompare('Résumé') === 0){
        tabText = 'Resume';
    }
    var currentTabHeight = $("#"+tabText).outerHeight(true);
    var backgroundHeight =  $("#Profile").outerHeight(true) + $(".tab").outerHeight(true) + currentTabHeight;
    // $("#particles-js").css("height", backgroundHeight);

    $('#particles-js').animate(
        {height: (backgroundHeight)},
        time,
        function () {
        }
    );
}

function setProfileTopMargin() {
    var windowHeight = $(window).outerHeight();
    var elementsInFirstViewHeight = $("#Profile").height() + $(".tab").height();
    var topMarginOfProfile = windowHeight - elementsInFirstViewHeight;
    if (topMarginOfProfile > 0){
        $("#Profile").css("margin-top", topMarginOfProfile);
    }
    else{
        $("#Profile").css("margin-top", "0px");
    }
}

function refresh() {
    setTabBtnsToCenter();

    $(window).resize(function () {
        setTabBtnsToCenter();

        setProfileTopMargin();

        //set the particle background height dynamically
        setBackgroundParticleHeight(0)
    });
	
	setProfileTopMargin();
}





