var mrMr = angular.module('mrMr', []);

mrMr.service('calcService', [function () {
    this.calculateAge = function (DateOfBirth) {
        var birthday = new Date(DateOfBirth);
        var ageDifMs = Date.now() - birthday.getTime();
        var ageDate = new Date(ageDifMs);
        var age = Math.abs(ageDate.getUTCFullYear() - 1970);
        return isNaN(age) ? 0 : age;
    };
    this.calculateBMI = function (Weight, Height) {
        var w = parseFloat(Weight);
        var h = parseFloat(Height / 100);
        return (w / (Math.pow(h, 2))).toFixed(2);
    };
    this.calculateBMR = function (Age, Gender, Weight, Height) {
        var a = typeof Age === "number" ? parseInt(Age) : parseInt(this.calculateAge(Age));
        var g = Gender !== false;
        var w = parseFloat(Weight);
        var h = parseFloat(Height);
        return (g ? (665.09 + (9.56 * w) + (1.84 * h) - (4.67 * a)) : (66.47 + (13.75 * w) + (5.0 * h) - (6.75 * a))).toFixed(2);
    };

}]);

mrMr.service("numberService", [function () {
    this.getPrice = function (text) {
        var number = parseFloat(text);
        if (isNaN(number)) {
            number = 0;
        }
        number = number.toFixed(2);
        number = number.toString().replace(".", ",");
        number = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return number + " kr";
    };
    this.getPrice2 = function (text, currency) {
        if (!currency) {
            currency = "&euro;";
        }

        var number = 0;
        var color = "inherit";


        number = parseFloat(text);

        if (isNaN(number)) {
            number = 0;
        }

        if (number < 0) {
            color = "red";
        }

        number = number.toFixed(2);
        number = number.toString().replace(",", ".");
        number = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        return currency + ' ' + number;
    };
}]);

mrMr.service("stringService", [function () {
    this.parse = function (text, start, end) {
        return text.slice((text.indexOf(start) + start.length), text.indexOf(end));
    };
    this.stripHTMLFromText = function (text) {
        return text.replace(/<(?:.|\n)*?>/gm, '');
    };
    this.truncate = function (text, maxLength) {
        return (text.length > maxLength) ? text.substring(0, maxLength) : text;
    };
    this.upper = function (text) {
        return (text.length > 1) ? (text.charAt(0).toString().toUpperCase() + text.substring(1)) : text;
    };
    this.getName = function (text, last) {
        var ib = text.indexOf(" ") !== -1 ? text.split(' ') : [text];
        for (let i = 0; i < ib.length; i++) {
            if (i !== 0) {
                if (i !== ib.length - 1) {
                    ib[i] = ib[i].substring(0, 1) + ".";
                }
                else {
                    if (last !== true) {
                        ib[i] = ib[i].substring(0, 1) + ".";
                    }
                }
            }
        }
        return ib.join(" ");
    };
    this.getName2 = function (text) {
        return (text.length > 1) ? (text.charAt(0).toString().toUpperCase() + text.substring(1)) : text;
    };
}]);

mrMr.service("objService", [function () {
    this.getUniqueProperties = function (list, prop) {
        if (list) {
            if (prop) {
                return new Array(...new Set(list.map(x => x[prop])));
            }
            else {
                return new Array(...new Set(list));
            }
        }
    };
    this.getSum = function (arr, obj) {
        var val = 0;
        if (arr) {
            if (obj) {
                for (a of arr) {
                    val += a[obj];
                }
            }
            else {
                for (a of arr) {
                    val += a;
                }
            }
        }
        return val;
    };
    this.checkAnyKeyForSpecificValue = function (object, checkValue) {
        var ok = false;
        for (let key in object) {
            if (object[key] === checkValue) {
                ok = true;
                break;
            }
        }
        return ok;
    };
}]);

mrMr.service("dateService", [function () {
    this.getDateDK = function (date) {
        return moment(date).format("DD-MM-YYYY");
    };
    this.getDateUK = function (date) {
        return moment(date).format("YYYY-MM-DD");
    };
}]);

mrMr.service('helperService', [function () {
    this.generateRandomString = function (strLength) {
        var returnString = "";
        var allowedCharacters = "ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789";

        while (returnString.length < strLength) {
            var randomNumber = Math.floor((Math.random() * allowedCharacters.length));
            returnString += allowedCharacters.charAt(randomNumber);
        }

        return returnString;
    };
}]);


	mrMr.directive("mrsort", [function() {
        return {
            restrict: "E",
            template: "<span ng-mouseover='getCursor($event)' ng-click='sort()'><i ng-class='getIcon()' aria-hidden='true'></i>&nbsp;{{label}}</span>",
            scope: {
                lbl: "@",
                srt: "@",
                icn: "@",
                ord: "@",
                drt: "@"
            },
            link: function (scope) {
                var sort = scope.ord ? scope.ord.toString() : "sortOrder";
                var dir = scope.drt ? scope.drt.toString() : "sortDirection";
    
                scope.label = scope.lbl;
                scope.sort = function () {
                    if (scope.$parent[sort] === scope.srt) {
                        scope.$parent[dir] = !scope.$parent[dir];
                    }
                    scope.$parent[sort] = scope.srt;
                };
                scope.getCursor = function ($event) {
                    $event.target.style.cursor = "pointer";
                };
                scope.getIcon = function () {
                    var icon = true;
                    if (scope.icn) {
                        icon = false;
                    }
                    if (icon) {
                        if (scope.$parent[sort] === scope.srt) {
                            if (scope.$parent[dir] === true) {
                                return "fa fa-sort-desc";
                            }
                            else {
                                return "fa fa-sort-asc";
                            }
                        }
                        else {
                            return "fa fa-sort";
                        }
                    }
                    else {
                        return "";
                    }
                };
            }
        };
    }]);
	
	mrMr.directive("mrspin", [function() {
		return {	
			restrict : "E",
			template : "<i style='font-size:{{size}}px; color: {{color}}' class='fa fa-spinner fa-pulse fa-3x fa-fw'></i>",
			scope : {
				color: "@",
				size: "@"
			},			
        }
    }]);
	
    mrMr.filter('mrHtml', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }]);
	
	mrMr.filter('mrStrip', [function () {
        return function (text) {
			var strippedText = text.replace(/<(?:.|\n)*?>/gm, '');
            return strippedText;
        };
    }]);

    mrMr.filter('mrHappy', ['$sce', function ($sce) {
        return function (text, cls) {
            var colours = cls ? cls : ["Red", "Blue", "Orange", "Purple", "Green"];
            var returnText = "";
            var colourIndex = 0;
            for (let i = 0; i < text.length; i++) {
                returnText += "<span style='color:" + colours[colourIndex] + ";'>" + text.charAt(i) + "</span>";
                colourIndex++;
                if (colourIndex == colours.length) {
                    colourIndex = 0;
                }
            }
            return $sce.trustAsHtml(returnText);
        };
    }]);
	
	mrMr.filter('mrBin', [function () {
        return function (text) {
			var binary = ""
			for (let i = 0; i < text.length; i++) {
				let ib = "";
				ib = text[i].charCodeAt(0).toString(2);
				while (ib.length < 8) {
					ib = "0" + ib;
				}
				binary += ib;
			}
            return binary;
        };
    }]);
	
	mrMr.filter('mrOct', [function () {
        return function (text) {
			var binary = ""
			for (let i = 0; i < text.length; i++) {
				binary += text[i].charCodeAt(0).toString(8);
			}
            return binary;
        };
    }]);
	
	mrMr.filter('mrHex', [function () {
        return function (text) {
			var binary = ""
			for (let i = 0; i < text.length; i++) {
				binary += text[i].charCodeAt(0).toString(16);
			}
            return binary;
        };
    }]);
	
	mrMr.filter('mrKr', [function () {
        return function (text) {
			var kr = !isNaN(text) ? parseFloat(text) : 0;
            return kr.toFixed(2).toString().replace(".",",") + " kr.";
        };
    }]);
	
	mrMr.filter('mrParse', [function () {
        return function (text, start, end) {
			return text.slice((text.indexOf(start) + start.length), text.indexOf(end));
        };
    }]);
	
	mrMr.filter('mrTruncate', [function () {
        return function (text, maxLength) {
			return (text.length > maxLength) ? text.substring(0, maxLength) : text;
        };
    }]);
	
	mrMr.filter('mrUpper', [function () {
        return function (text) {
			return (text.length > 1) ? (text.charAt(0).toString().toUpperCase() + text.substring(1)) : text;
        };
    }]);

    mrMr.filter('ageFilter', ['calcService', function (calcService) {
        return function (DateOfBirth) {
            return calcService.calculateAge(DateOfBirth);
        };
    }]);
    
    mrMr.filter('BMIFilter', ['calcService', function (calcService) {
        return function (Weight, Height) {
            return calcService.calculateBMI(Weight, Height);
        };
    }]);
    
    mrMr.filter('BMRFilter', ['calcService', function (calcService) {
        return function (Age, Gender, Weight, Height) {
            return calcService.calculateBMR(Age, Gender, Weight, Height);
        };
    }]);
    
    mrMr.filter('ceil', [function () {
        return function (number) {
            return Math.ceil(number);
        };
    }]);
    
    mrMr.filter('dateFilter', ['dateService', function (dateService) {
        return function (date, uk) {
            if (!date) {
                return "-";
            } else {
                return uk ? dateService.getDateUK(date) : dateService.getDateDK(date);
            }
        };
    }]);
    
    mrMr.filter('lower', [function () {
        return function (text) {
            return text.toString().toLowerCase();
        };
    }]);
    
    mrMr.filter('name', ['stringService', function (stringService) {
        return function (text, last) {
            return stringService.getName(text, last);
        };
    }]);
    
    mrMr.filter('name2', ['stringService', function (stringService) {
        return function (text) {
            return stringService.getName2(text);
        };
    }]);
    
    mrMr.filter('price', ['numberService', function (numberService) {
        return function (text) {
            return numberService.getPrice(text);
        };
    }]);
    
    mrMr.filter('price2', ['$sce', 'numberService', function ($sce, numberService) {
        return function (text, currency) {
            return $sce.trustAsHtml("<span style='color:" + color + ";'>" + numberService.getPrice2(text, currency) + "</span>");
        };
    }]);    
   
    mrMr.filter('truncate', [function () {
        return function (num, len) {
            if (!len) {
                len = 32;
            }
    
            var n = num.toString();
    
            if (n.length > len) {
                n = n.slice(0, len) + "...";
            }
    
            return n;
        };
    }]);

	/*
	mrMr.filter('mrName', [function () {
        return function (text, last) {
			var ib = text.indexOf(" ") != -1 ? text.split(' ') : [text];
			for (let i = 0; i < ib.length; i++) {
				if (i != 0) {
					if (i != ib.length -1) {
						ib[i] = ib[i].substring(0,1) + ".";
					}
					else {
						if (last != true) {							
							ib[i] = ib[i].substring(0,1) + ".";
						}
					}
				}
			}
			return ib.join(" ");
        };
}]);
*/

