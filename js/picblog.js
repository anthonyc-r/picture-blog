/**
* Author: Anthony Cohn-Richardby
* A little slideshow app
**/
console.log("PicBlog.js - Loaded");

var ExamplePicBlogDataSource = function() {
	
}
ExamplePicBlogDataSource.prototype.requestData = function(page, pageSize, callback) {
	callback([
	{
		"title": "Test Post!",
		"date": "01/01/1970",
		"image": "img/1.jpeg",
		"imageDesc": "Example image",
		"body": "This is an example!"
	}, {
		"title": "Another test post?!",
		"date": "01/01/1971",
		"image": "img/3.jpeg",
		"imageDesc": "Example image",
		"body": "This is another example!"
	}
	]);
}

var PicBlog = function(dataSource) {
	//Hide all but the first div
	this.numSlides = 0;
	this.pageIndex = 0;
	this.pageSize = 4;
	this.slideIndex = 0;
	this.dataSource = dataSource;
	this.configure();
}

/**private methods**/

/**
* configure
* Configure the articles within the picblog to display in the slideshow format.
**/
PicBlog.prototype.configure = function() {
	this.slides = $("#picblog").children("article");
	this.div = $("#picblog");
	this.numSlides = this.slides.length;
	//Data source returned less than the page size
	if (this.slideIndex >= this.numSlides) {
		this.slideIndex = this.numSlides - 1;
	}
	//Hide all slides but not the current slide
	this.slides.not(this.slides[this.slideIndex]).hide();
	this.restyle();
	this.addControlButtons();
}

/**
* showLoading
* Display a spinning wheel gif to indicate loading
**/
PicBlog.prototype.showLoading = function() {
	var loadingCSS = {
		"position" : "absolute",
		"background": "rgba(225, 225, 225, 0.75)",
		"border-radius": "10%",
		"width"	  : "auto",
		"height"  : "5%",
		"top"	  : "45%",
		"left"    : "45%",
		"z-index" : "100"
	}
	var loader = this.div.append("<img id='loader' src='img/loading.gif'></img>").children("#loader");
	loader.css(loadingCSS);
}

/**
* hideLoading
* Remove the spinning wheel gif if present
**/
PicBlog.prototype.hideLoading = function() {
	this.div.children("#loader").remove();
}

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
* transition
* Transition from the old slide to the new slide
**/
PicBlog.prototype.displaySlide = function(oldSlide, newSlide) {
	//Get rid of the old and busted, bring in the new hotness
	oldSlide.css({"z-index": "100", "display":"block"});
	newSlide.css({"z-index":"99", "display":"block"});

	newSlide.show();
	console.log("TEST");
	console.log(newSlide);
	oldSlide.fadeOut(500);
}

/**
* changeBlog
* Changes the currently displayed blog post. Impl depends on if data source present.
**/
PicBlog.prototype.changeBlog = function(num) {
	if (this.dataSource == null) {
		this.changeBlogRotate(num);
	} else {
		this.changeBlogDataSource(num);
	}
}

/**
* changeBlogRotate
* Changes the currently displayed blog post.
* If num >= 0, then the next post is displayed, else the previous post is displayed.
**/
PicBlog.prototype.changeBlogRotate = function(num) {
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
	this.displaySlide(old, newHotness);
}

/**
* changeBlogDataSource
* Upon reaching the last article, trigger an request for more data
**/
PicBlog.prototype.changeBlogDataSource = function(num) {
	var old = this.slides.eq(this.slideIndex);
	//Decrease index or inc based on the input
	if (num >= 0) {
		this.slideIndex++;
	} else {
		this.slideIndex--;
	}
	if (this.slideIndex >= this.numSlides) {
		this.pageIndex++;
		this.slideIndex = 0;
		this.fetchNewData();
		return;
	} else if (this.slideIndex < 0 && this.pageIndex < 1) {
		this.pageIndex = 0;
		this.slideIndex = 0;
		return;
	} else if (this.slideIndex < 0) {
		this.pageIndex--;
		this.slideIndex = this.pageSize - 1;
		this.fetchNewData();
		return;
	}
	//Wrap numbers around so we just loop back
	var newHotness = this.slides.eq(Math.abs(this.slideIndex % this.numSlides));
	this.displaySlide(old, newHotness);
}

PicBlog.prototype.fetchNewData = function() {
	this.showLoading();
	this.dataSource.requestData(this.pageIndex, this.pageSize, function(newSlides) {
		this.hideLoading();
		if (newSlides.length == 0) {
			console.log("No new data...");
			return;
		}
		this.div.html("");
		var articles = newSlides.forEach(function(obj) {
			var head = "<div class='head'><h1>" + obj["title"] + "<span> " + obj["date"] + "</span></h1></div>";
			var img = "<img src='" + obj["image"] + "' alt='" + obj["imageDesc"] + "'>";
			var body = "<div class='body'><p>" + obj["body"] + "</p></div>";
			var newArticle = this.div.append("<article></article>").children().last();
			newArticle.append(head);
			newArticle.append(img);
			newArticle.append(body);
		}.bind(this));
		this.configure();
	}.bind(this));
}

/**test harness*/
$(document).ready(function() {
	var pb = new PicBlog(new ExamplePicBlogDataSource());

});