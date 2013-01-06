;(function( $ ) {
	var pluginName = "cc",
		defaults = {
			document: $(document),
			edittedIndex: 0, //tracks number elements that have had color adjusted
			canvasCount: 0,
			cache: {} // stores org. canvas prior to color adjusting. 
		};

	var methods = {
		init : function(){  // Initlizing function, probably need it later 

		},
		makeCanvas : function( options ){ // Makes canvas of specified size 
										  // options = { width: INT, height: INT }
			var canvas = document.createElement('canvas');

			canvas.width = options.width;
			canvas.height = options.height;
			canvas.setAttribute('class', 'cc'); // adds the cc class so we can find it later
			canvas.setAttribute('style', 'position:absolute; z-index:'+(defaults.canvasCount*10)+';');

			return canvas;
		},
		drawToCanvas : function( img ){ // returns canvas with image draw to it 
			var canvas = this[0],
				ctx = canvas.getContext('2d');

			ctx.drawImage(img, 0, 0);
			return canvas;
		},
		getCachedData : function(){
			var $canvas = this,
				canvas = $canvas[0];

			if(!canvas.getAttribute('data-adjusted')){
				defaults.edittedIndex++;
				canvas.setAttribute('data-adjusted',true);

				if(!canvas.getAttribute('id')){
					canvas.setAttribute('id','ccAdjusted'+defaults.edittedIndex);
				}

				defaults.cache[canvas.getAttribute('id')] = canvas;
			}
			return defaults.cache[canvas.getAttribute('id')];
		},
		addLayer : function( imgsArr ){ // Adds image/s to sized camvas and appends it to target 
			var fragment = document.createDocumentFragment(), // frag. so we only write to DOM once
				imgsLength;
				
			if(imgsArr instanceof Array){
				imgsLength = imgsArr.length;
			}
			else{
				imgsArr = [imgsArr];
				imgsLength = imgsArr.length;
			}
				
			
			while(imgsLength--){ // loops through all images past, adding each to its own canvas
				var img = imgsArr[imgsLength][0],
					canvas = $(document).cc('makeCanvas', { width : img.width, height : img.height });
					
				fragment.appendChild( $(canvas).cc('drawToCanvas', img) );
			}

			this[0].appendChild( fragment );  // DOM write
			defaults.canvasCount++;
			defaults.document.trigger('canvasadd');  //custom event incase anyone is listening
		},
		removeLayer : function(){  // Removes a selected canvas from the DOM 
			return this.each(function(){
				$(this).remove();
				defaults.document.trigger('canvasremove');
			});
		},
		adjustColor : function( rgb ){ 
			var canvas = $(this).cc('getCachedData'),
				ctx = canvas.getContext('2d'),
				imgData = ctx.getImageData(0, 0, canvas.width, canvas.height),
				pixels = imgData.data,
				numPixels = pixels.length,
				red = rgb.red,
				green = rgb.green,
				blue = rgb.blue;

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			while(numPixels--) { // adjusts color. could be broken out into web worker. maybe a worker per channel
			      pixels[numPixels*4] = pixels[numPixels*4]+(red);
			      pixels[numPixels*4+1] = pixels[numPixels*4+1]+(green);
			      pixels[numPixels*4+2] = pixels[numPixels*4+2]+(blue);
			}
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.putImageData(imgData, 0, 0);
		},
		compileLayers : function(){ // returns one canvas that includes all Selected canvases 
			var thisLength = this.length,
				heights = [],
				widths = [],
				canvas,
				maxHeight,
				maxWidth,
				img;

			// Finds the largest height and width amoung all the canvases
			while(thisLength--){
				heights.push(this[thisLength].height);
				widths.push(this[thisLength].width);
			}
			maxHeight = Math.max.apply( Math, heights );
			maxWidth = Math.max.apply( Math, widths );
			
			// Makes canvas that can fit all content
			canvas = defaults.document.cc('makeCanvas', { width : maxWidth, height : maxHeight });  
			
			thisLength = this.length;
			while(thisLength--){ // draws content from each canvas into the master canvas
				$(canvas).cc('drawToCanvas', this[thisLength]);
			}
			
			img = $(canvas).cc('createImg');
			
			defaults.document.trigger('cavnasescompiled');  //custom event trigger, just in case...
			
			return img;			
		},
		createImg : function(){
			var canvas = this[0],
				canvasData = canvas.toDataURL("image/png"),
				img = new Image(canvasData);
				
				img.width = canvas.width;
				img.height = canvas.height;
				
				img.src=canvasData;
				
				return img;
		}
	};
	
	$.fn.cc = function( method, options ) { // basic routing 
								   			// method = 'methodName'
											// options = ['element', 'element']
											
		if ( methods[method] ) { // allows you to call each method as an option
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {  // change defaults
			return methods.init.apply( this, arguments );
		} else {  // error handling
			$.error( 'Method ' +  method + ' does not exist on jQuery.cc' );
		}
		
	};

})( jQuery );