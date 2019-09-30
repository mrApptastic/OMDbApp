var dataHussar = function (element, dataset, settings = {})										
{
	var dh = this;
	dh.elem = document.getElementById(element);
	dh.data = dataset;
	dh.set = {
		"start" : settings.start ? settings.start : true, 	
		"width" : settings.width ? settings.width : 1100, 
		"height" : settings.height ? settings.height : 400,
		"delay" : settings.delay ? settings.delay : 1,
		"stroke" : settings.stroke ? settings.stroke : 2,
		"colour" : settings.colour ? settings.colour : "dodgerblue",
		"dotColour" : settings.dotColour ? settings.dotColour : "dodgerblue",
		"valueFont" : settings.valueFont ? settings.valueFont : "initial",
		"valueSize" : settings.valueSize ? settings.valueSize : "initial",
		"valueColour" : settings.valueColour ? settings.valueColour : "red",
		"valueOffsetX" : settings.valueOffsetX ? settings.valueOffsetX : 15,
		"valueOffsetY" : settings.valueOffsetY ? settings.valueOffsetY : 10,			
		"lineColour" : settings.lineColour ? settings.lineColour : "silver",
		"xStep" : settings.xStep ? settings.xStep : 12,
		"yStep" : settings.yStep ? settings.yStep : 6,
		"labelXFont" : settings.labelXFont ? settings.labelXFont : "initial",
		"labelYFont" : settings.labelYFont ? settings.labelYFont : "initial",
		"labelXSize" : settings.labelXSize ? settings.labelXSize : "initial",
		"labelYSize" : settings.labelYSize ? settings.labelYSize : "initial",
		"labelXOffset" : settings.labelXOffset ? settings.labelXOffset : -15,
		"labelYOffset" : settings.labelYOffset ? settings.labelYOffset : 10,
		"labelXColour" : settings.labelXColour ? settings.labelXColour : "black",
		"trendLine" : settings.trendLine ? settings.trendLine : false,
		"trendLineColour" : settings.trendLineColour ? settings.trendLineColour : "red",
		"trendLineFunction" : settings.trendLineFunction ? settings.trendLineFunction : true,
		"trendLineTextXOffset" : settings.trendLineTextXOffset ? settings.trendLineTextXOffset : 15,
		"trendLineTextYOffset" : settings.trendLineTextYOffset ? settings.trendLineTextYOffset : 15,
		"trendLineTextColour" : settings.trendLineTextColour ? settings.trendLineTextColour : "red"

	};
	dh.init = function() {
		document.getElementsByTagName("head")[0].innerHTML += "<style> @-webkit-keyframes " + dh.elem.id + "-dash { to { stroke-dashoffset: 0; } } @keyframes " + dh.elem.id + "-dash { to { stroke-dashoffset: 0; } </style>";
		document.getElementById(element).setAttribute("width", dh.set.width);
		document.getElementById(element).setAttribute("height", dh.set.height);
		if (dh.set.start) {
			dh.draw();
		}
	};
	dh.max = function() {
		var mx = dh.data[0].Value;
		for (var i = 1; i < dh.data.length; i++) {     
			if (dh.data[i].Value > mx) {
				mx = dh.data[i].Value;
			}
		}
		return mx;
	};
	dh.slp = function (data) {
		var summation = 0;
		var sumX = 0;
		var sumY = 0;
		var squaredX = 0;
		for (let i = 0; i < data.length; i++) {
			summation += ((i + 1) * data[i].Value)
			sumX += (i + 1);
			sumY += data[i].Value;
			squaredX += ((i + 1) * (i + 1));			
		}
		var a = (data.length) * summation;
		var b = sumX * sumY;
		var c = (data.length) * squaredX;
		var d = sumX * sumX;		
		return ((a - b) / (c -d));
	};
	dh.yin = function (data, slope) {
		var sumX = 0;
		var sumY = 0;
		for (let i = 0; i < data.length; i++) {
			sumX += (i + 1);
			sumY += data[i].Value;
		}
		var e = sumY;
		var f = slope * sumX;
		return ((e - f) / (data.length));
	};
	dh.draw = function () {		
		var output = "";
	/*

		if (1 == 1) {
			let slope = dh.slp(dh.data);
			let yInt = dh.yin(dh.data, slope);
			let x1 = 0; //(ib * step);
			let y1 = (dh.set.height - dh.data[ib].Value * (dh.set.height / maxValue));
			let x2 = ((dh.data.length) * step);
			let y2 = (dh.set.height - dh.data[ib + 1].Value * (dh.set.height / maxValue));
			let x1 = 0 //0; //(ib * step);
			let y1 = (slope * 0) + yInt //(dh.set.height - dh.data[0].Value * (dh.set.height / maxValue));
			let x2 = (dh.data.length -1); //((dh.data.length) * step);
			let y2 = (slope * dh.data.length -1) + yInt //(dh.set.height - dh.data[dh.data.length -1].Value * (dh.set.height / maxValue));
					   output += '<path class="' 
							  + this.elem.id 
							  + '_graphLine" d="M ' 
@@ -105,11 +107,9 @@ var dataHussar = function (element, dataset, settings = {})
							  + dh.set.stroke 
							  + '" fill="none" />'
		}
		*/
        var bob = dh.set.yStep;
		var maxValue = Math.max.apply(Math,dh.data.map(function(o){return o.Value;})); // dh.max();
		/* Add 1/5 space to the top */
		maxValue = maxValue * 1.1;
		var step = dh.set.width / dh.data.length;
		var dv = Math.ceil(dh.data.length / dh.set.xStep);
		var divider = dh.data.length > dh.set.xStep ? dv : 1;
		var pointIndex = 0;
        for (var tom = 0; tom <= bob; tom++) {
			let y1 = (dh.set.height - parseInt((maxValue / bob) * tom) * (dh.set.height/ maxValue));
			let x2 = dh.set.width;
			let y2 = (dh.set.height - parseInt((maxValue / bob) * tom) * (dh.set.height / maxValue));
					   output += '<line x1="0" y1="'
							  + y1 
							  +'" x2="'
							  + x2 
							  + '" y2="'
							  + y2 
							  + '" style="stroke:'
							  + dh.set.lineColour 
							  + ';stroke-width:'
							  + dh.set.stroke 
							  + '" /><text x="0" y="'
							  + (dh.set.height - (parseInt((maxValue / bob) * tom) - dh.set.labelYOffset) * (dh.set.height / maxValue)) 
							  + '" fill="'
							  + dh.set.labelYColour 
							  + '" font-family="' 
							  + dh.set.labelYFont 
							  + '" font-size="' 
							  + dh.set.labelYSize 
							  + '">'
							  + parseInt((maxValue / bob) * tom) 
							  +'</text>';
        } 
		for (var ib = 0; ib < dh.data.length -1; ib++) {
			let x1 = (ib * step);
			let y1 = (dh.set.height - dh.data[ib].Value * (dh.set.height / maxValue));
			let x2 = ((ib + 1 ) * step);
			let y2 = (dh.set.height - dh.data[ib + 1].Value * (dh.set.height / maxValue));
					   output += '<path class="' 
							  + this.elem.id 
							  + '_graphLine" d="M ' 
							  + x1 
							  + ' ' 
							  + y1 
							  + ' l ' 
							  + (x2 - x1) 
							  + ' ' 
							  + (y2 - y1) 
							  + '" stroke="' 
							  + dh.set.colour
							  +'" stroke-width="' 
							  + dh.set.stroke 
							  + '" fill="none" />'
			if (ib % divider == 0) {
						   output += '<text x="'
								  + ib * step
								  +'" y="'
								  + (dh.set.height 
								  + dh.set.labelXOffset)
								  +'" fill="'
								  + dh.set.labelXColour 
								  +'" font-family="' 
								  + dh.set.labelXFont 
								  + '" font-size="' 
								  + dh.set.labelXSize 
								  + '">'
								  + dh.data[ib].Label 
								  +'</text>';
						   output += '<circle style="transition: 0.5s; cursor: pointer; opacity: 0;" ' 
								  + 'data-'
								  + dh.elem.id.toLowerCase() 
								  + '-index="' 
								  + pointIndex 
								  + '" class="' 
								  + dh.elem.id 
								  + '_Point" cx="' 
								  + ib * step 
								  + '" cy="' 
								  + (dh.set.height - dh.data[ib].Value * (dh.set.height / maxValue)) 
								  + '" r="5" stroke="' 
								  + dh.set.dotColour 
								  + '" stroke-width="1" fill="white" />';
								  /*
							output += '<text style="opacity:0;transition: 0.5s;z-index:2;" x="'
								  + (ib * step + dh.set.valueOffsetX)
								  +'" y="'
								  + (dh.set.height - dh.data[ib].Value * (dh.set.height / maxValue) - dh.set.valueOffsetY)
								  +'" stroke="'
								  + 'lime'  
 								  +'" stroke-width="'
								  + '0.5em'  
								  +'" class="' 
								  + dh.elem.id 
								  + '_TextLbl" font-family="' 
								  + dh.set.valueFont 
								  + '" font-size="' 
								  + dh.set.valueSize 
								  + '">'
								  + dh.data[ib].Value 
								  +'</text>';
								  */
						   output += '<text style="opacity:0;transition: 0.5s;z-index:1;" x="'
								  + (ib * step + dh.set.valueOffsetX)
								  +'" y="'
								  + (dh.set.height - dh.data[ib].Value * (dh.set.height / maxValue) - dh.set.valueOffsetY)
								  +'" fill="'
								  + dh.set.valueColour  
								  +'" class="' 
								  + dh.elem.id 
								  + '_Text" font-family="' 
								  + dh.set.valueFont 
								  + '" font-size="' 
								  + dh.set.valueSize 
								  + '">'
								  + dh.data[ib].Value 
								  +'</text>';
				pointIndex++;
			}
			
			if (dh.set.start) {
				dh.elem.innerHTML = output;
			}		

		}
		
		if (dh.set.start) {
			dh.anit();
		}
		
		return output;
	};
	dh.anit = function () {
		var points = document.getElementsByClassName(this.elem.id + "_Point");
		// var textbgs = document.getElementsByClassName(this.elem.id + "_TextLbl");
		var texts = document.getElementsByClassName(this.elem.id + "_Text");
		var at = "data-" + dh.elem.id.toLowerCase() + "-index";
		for (var y = 0; y < points.length; y++) {
			points[y].addEventListener("mouseover", function(event) {
				var index = this.getAttribute(at);
				this.style.strokeWidth = 10;
				// textbgs[index].style.opacity = 1;
				texts[index].style.opacity = 1;
			});
			points[y].addEventListener("mouseout", function(event) {
				var index = this.getAttribute(at);
				this.style.strokeWidth = 1;
				// textbgs[index].style.opacity = 0;
				texts[index].style.opacity = 0;
			});
		}	
		dh.anim(this.elem.id + "_graphLine", (dh.set.delay / dh.data.length)); 
		dh.boun(this.elem.id + "_Point", (dh.set.delay / points.length));
	};
	dh.anim = function (cl, dl) {
		for (var i = 0; i < document.getElementsByClassName(cl).length;i++) {
			var thisPath = document.getElementsByClassName(cl)[i];
			var l = thisPath.getTotalLength();
			thisPath.style.strokeDasharray = l;
			thisPath.style.strokeDashoffset = l;
			thisPath.style.opacity = 1;
			thisPath.style.animation = this.elem.id + "-dash " + dl + "s linear forwards";
			thisPath.style.webkitAnimation = this.elem.id + "-dash " + dl + "s linear forwards";
			thisPath.style.animationDelay = (i * dl) + "s";
			thisPath.style.webkitAnimationDelay = (i * dl) + "s";
		}
	};
	dh.boun = function (cl, dl) {
		var elm = document.getElementsByClassName(cl).length;
		var count = 0;
		var delay = dl * 1000;
		var mrBouncy = setInterval(function() {
			if (count == elm) {
				clearInterval(mrBouncy);
			}
			else {
				document.getElementsByClassName(cl)[count].style.opacity = 1;
				count++;	
			}
		}, delay);
	};
	dh.init();
};