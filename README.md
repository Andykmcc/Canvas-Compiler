Canvas-Compiler
===============

*jQuery plugin for modifying and layering images with the canvas.*

This plugin allows you to easily add images to canvas elements. You can then modify their RGB values. Finally flattening all the canvas layers together and outputting an image element using PNG data. 

This plugin was abstracted from the avatar maker on http://www.manyshadesofgay.org/

Example Usage
--------------

<pre>
	var img1 = document.getElementById('img1'); // First image you'd like to modify
	var img2 = document.getElementById('img2'); // Second image you'd like to modify
	
	$('body').cc('addLayer', img1); // Appends img1 canvas to body element.
	$('body').cc('addLayer', img2);// Appends img2 canvas to body element.
	
	$(img1).cc('adjustColor', {red: 100, green: 0, blue: 0}); // Adds 100 units or red to img1
	$(img2).cc('adjustColor', {red: 20, green: -20, blue: -255}); // Adds 20 red, and removes 20 green and all blue.
	
	var flattenedImg = $('canvas').cc('compileLayers'); // Flattens all canvases into png and caches in 'flattenedImg' var.
	
	$('body').append(flattenedImg);  // appends flattened png to the body element. 
</pre>


Important things to note
________________________

* Each canvas that is added is given the class 'cc', a z-index and is absolutely positioned in the target element. 
* The addlayer method can take an array of image elements. Each will get their own canvas. 
* The technique use to add image to a canvas is CORS sensitive. You  must host the images you are using.