//returns text
function linkify($messageDiv, text) {
	var wordAndSpacePattern = /[\s]*[^\s]+/gi;
	var urlPattern = /^[\s]*(https?:\/\/)?((([a-z]([\-\w]*[\w])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[\-a-z%_\.~+]*)*(\?[\-\w;&%_\.~+=]*)?(\#[\-a-z_]*)?$/i;
	var lineMatches = text.split(/\r\n|\r|\n/);
	for (i=0; i<lineMatches.length; i++) {
		$lineWrap = $("<pre></pre>");
		var wordMatches = lineMatches[i].match(wordAndSpacePattern);
		if (wordMatches) {
			for (j=0; j<wordMatches.length; j++) {
				if (urlPattern.test(wordMatches[j])) {
					var start = wordMatches[j].search(/[\w]/);
					var text = wordMatches[j].slice(0, start);
					$lineWrap.append(text);
					$lineWrap.append(routeLink(wordMatches[j]));
				}
				else {
					$lineWrap.append(wordMatches[j]);
				}
			}
		}
		$messageDiv.append($lineWrap);
	}
}

function routeLink(url) {
	console.log("URL: " + url);
	var $newLink = $("<a></a>");
	var formatUrl = formatURL(url)
	$newLink.attr("href", formatUrl);
	if (url.match(/youtube\./))
	{
		linkYoutube(url, $newLink);
	}
	else {
		linkGeneric(url, $newLink);
	}
	return $newLink;
}

function formatURL(url) {
	var start = url.search(/[\w]/);
	var text = url.slice(start);
	if (!text.match(/^[\s]*(https?:\/\/)/)) {
		text = 'http://' + text;
	}
	return text;
}

function linkGeneric(url, $linkElement) {
	var start = url.search(/[\w]/);
	var text = url.slice(start);
	$linkElement.html(text);
}

//thumbnail is true of faulse
//returns <a> jquery $object
function linkYoutube(url, $linkElement) {
	if (url.search(/[\\?&]v=([^&#]*)/) >= 0) {
		$linkElement.append(getScreen(url, "small"));
	}
	else {
		linkGeneric(url, $linkElement);
	}
}

function getScreen( url, size ) {
	var $newImg = $("<img />")
  if(url === null){ return ""; }

  size = (size === null) ? "big" : size;
  var vid;
  var results;

  results = url.match(/[\\?&]v=([^&#]*)/);

  console.log(results, url);

  vid = ( results === null ) ? url : results[1];
   $newImg.attr("alt", "Youtube Video Thumbnail");

  if(size == "small"){
    $newImg.attr("src", "http://img.youtube.com/vi/"+vid+"/2.jpg");
  } else {
    $newImg.attr("src", "http://img.youtube.com/vi/"+vid+"/0.jpg");
  }
  return $newImg;
}

//thumbnail is true of faulse
//returns <a> jquery $object
function linkVimeo(url, linkElement, thumbnail) {

}
