onmessage = function(e){
	while(e.data.numPixels--) {
		e.data.pixels[e.data.numPixels*4] = e.data.pixels[e.data.numPixels*4]+(e.data.red);
		e.data.pixels[e.data.numPixels*4+1] = e.data.pixels[e.data.numPixels*4+1]+(e.data.green);
		e.data.pixels[e.data.numPixels*4+2] = e.data.pixels[e.data.numPixels*4+2]+(e.data.blue);
	}
	postMessage({'pixels':e.data.pixels});
};