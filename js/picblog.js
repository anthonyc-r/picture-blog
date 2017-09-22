console.log("PicBlog.js - Loaded");

var PicBlog = function() {
	//Hide all but the first div
	this.slides = $("#picblog").children("article");
	this.div = $("#picblog");
	this.slideIndex = 0;
	this.numSlides = this.slides.length;

	//Hide all slides but not the current slide
	this.slides.not(this.slides[this.slideIndex]).hide();
	this.restyle();
	this.addControlButtons();
}

/**public methods**/


/**private methods**/
/**
* restyle
* Do initial restyling nessessary
**/
PicBlog.prototype.restyle = function() {
	var prechange = this.div.css("height");
	var newArticleCSS = {
		"position" : "absolute",
		"top"	   : "0px",
		"left"	   : "0px",
	}

	this.slides.css(newArticleCSS);
	//The above change makes the division 0px high, reset it
	this.div.css("height", prechange);
}
/**
* addControlButtons
* Add a forward and back control button to the picblog division.
* Used to control the current slide being shown.
**/
PicBlog.prototype.addControlButtons = function() {
	var pbArticle = $("#picblog");
	var btnCSS = {
		"position": "absolute",
		"display" : "block",
		"z-index" : "1000",
		"height"  : "20%",
		"width"   : "5%",
		"top"	  : "40%",
		"border-radius" : "10px",
		"border"		: "none",
		"opacity"		: "1.0",
		"background-color" : "white",
		"margin" 		: "0px",
		"padding" 		: "0px",
		"font-size"		: "200%",
		"border"		: "1px solid black",
	}

	var leftBtn = pbArticle.prepend("<button id='leftBtn' class='left'>").children("#leftBtn");
	leftBtn.css(btnCSS).css("left", "0px");
	leftBtn.text("<");
	var rightBtn = pbArticle.append("<button id='rightBtn' class='right'>").children("#rightBtn");
	rightBtn.css(btnCSS).css("right", "0px");
	rightBtn.text(">");
	var bothBtn = $("button[id$=Btn]");
	//Get both of the added buttons
	var that = this;
	bothBtn.on({
		"mousedown" : function() {
			$(this).stop().animate({"opacity": "0.2"}, 100);
		},
		"mouseup" : function() {
			$(this).stop().animate({"opacity": "1"}, 100);
			if ($(this).hasClass("left")) {
				that.changeBlog(-1);
			}
			else {
				that.changeBlog(1);
			}
		}
	});

}

/**
* changeBlog
* Changes the currently displayed blog post.
* If num >= 0, then the next post is displayed, else the previous post is displayed.
**/
PicBlog.prototype.changeBlog = function(num) {
	var old = this.slides.eq(this.slideIndex);
	//Decrease index or inc based on the input
	if (num >= 0)
		this.slideIndex++;
	else
		this.slideIndex--;
	if (this.slideIndex >= this.numSlides)
		this.slideIndex = 0;
	if (this.slideIndex < 0)
		this.slideIndex = this.numSlides - 1;
	//Wrap numbers around so we just loop back
	var newHotness = this.slides.eq(Math.abs(this.slideIndex % this.numSlides));

	//Get rid of the old and busted, bring in the new hotness
	old.css({"z-index": "10", "display":"block"});
	newHotness.css({"z-index":"-10", "display":"block"});

	newHotness.show();
	old.fadeOut(500);
}

/**test harness*/
$(document).ready(function() {
	var pb = new PicBlog();

});