var rectAngular = function (elem, width, height, heading, colour, font) {
    var rect = this;
    rect.area = document.getElementById(elem);
    rect.ctxt = rect.area.getContext("2d");
    rect.draw = {
        "x1": null,
        "y1": null,
        "x2": null,
        "y2": null,
        "tx": null,
        "ty": null,
        "left": 10000,
        "score": 0,
        "start": null
    };
    rect.ball = {
        "x": 20,
        "y": 20,
        "w": 20,
        "mx": true,
        "my": true,
        "speed": 1,
        "step": 1,
        "count": 0
    };
    rect.set = {
        draw: null,
        ball: null
    };
    rect.init = function () {
        /* Save Base Rect Settings */
        if (!rect.set.draw) {
            rect.set.draw = JSON.stringify(rect.draw);
        }
        /* Save Base Ball Settings */
        if (!rect.set.ball) {
            rect.set.ball = JSON.stringify(rect.ball);
        }

        rect.area.width = width ? width : window.innerWidth;
        rect.area.height = height ? height : window.innerHeight;
        rect.ctxt.fillStyle = colour ? colour : "DodgerBlue";
        rect.ctxt.strokeStyle = colour ? colour : "DodgerBlue";
        rect.ctxt.font = font ? font : "30px Verdana";
        rect.screen();
    };
    rect.screen = function () {
        rect.area.style.cursor = "pointer";

        /* Clear Canvas */
        rect.ctxt.clearRect(0, 0, rect.area.width, rect.area.height);

        /* Get Dimensions */
        var offsetX = rect.area.width / 20;
        var offsetY = rect.area.height / 10;
        var row = rect.area.height / 20;
        var middle = rect.area.width / 2;

        /* Write Title */
        rect.ctxt.fillText((heading ? heading : "rectAngular"), middle - 100, 80);

        /* Write Instructions */
        rect.ctxt.fillText("Tap screen to start...", middle - 160, row * 4);

        /* Write High Score If Any */
        var highscore = rect.getHighScore();
        for (let i = 0; i < highscore.length; i++) {
            let d = new Date(highscore[i].date);
            let thisDate = d.getDate() + "/" + d.getMonth() + " " + (d.getYear() + 1900);
            rect.ctxt.fillText(i + 1 + "- " + highscore[i].score + " - " + highscore[i].name + " - " + thisDate, middle - 300, row * (6 + i * 2));
        }
    };
    rect.start = function () {
        /* Set Start Date */
        if (!rect.draw.start) {
            rect.draw.start = new Date();
        }
        /* Initialise Game Cyclus */
        rect.anima = setInterval(rect.paint, 1);
        rect.area.style.cursor = "none";
    };
    rect.stop = function () {
        /* Stop Game Cyclus */
        clearInterval(rect.anima);

        /* Handle Highscores */
        var highscore = rect.getHighScore();

        if (highscore.length < 5 || rect.draw.score > highscore[4].score) {
            var name = window.prompt("Enter Name for High Score");
            highscore.push({ "name": name, "score": rect.draw.score, "date": rect.draw.start });
            highscore = highscore.sort(function (x, y) {
                return y.score - x.score;
            });
            while (highscore.length > 5) {
                highscore.pop();
            }
            localStorage["RectScore"] = JSON.stringify(highscore);
        }

        /* Reset Game Objects */
        rect.draw = JSON.parse(rect.set.draw);
        rect.ball = JSON.parse(rect.set.ball);

        /* Draw Start Screen */
        rect.screen();
    };
    rect.getHighScore = function () {
        var highscore = new Array();
        var high = localStorage["RectScore"];
        if (high) {
            highscore = JSON.parse(high);
        }
        return highscore;
    };
    rect.area.onclick = function (e) {
        /* Check if game has begun */
        if (rect.draw.start !== null) {
            /* Check if there is line left */
            if (rect.draw.left > 0) {
                let x = e.pageX - (rect.area.getBoundingClientRect().left + window.scrollX);
                let y = e.pageY - (rect.area.getBoundingClientRect().top + window.scrollY);

                /* Step One: Set x1 and y1 */
                if ((!rect.draw.x1 && !rect.draw.y1 && !rect.draw.x1 && !rect.draw.y1) || (rect.draw.x1 && rect.draw.y1 && rect.draw.x2 && rect.draw.y2)) {
                    rect.draw.x1 = x;
                    rect.draw.y1 = y;
                    rect.draw.x2 = null;
                    rect.draw.y2 = null;
                }
                /* Step Two: Set x2 and y2 and draw rectangle */
                else if (rect.draw.x1 && rect.draw.y1 && !rect.draw.x2 && !rect.draw.y2) {
                    rect.draw.x2 = x;
                    rect.draw.y2 = y;

                    /* Modify Line Left */
                    let x_1 = rect.draw.x1 > rect.draw.x2 ? rect.draw.x2 : rect.draw.x1;
                    let x_2 = rect.draw.x1 > rect.draw.x2 ? rect.draw.x1 : rect.draw.x2;
                    let y_1 = rect.draw.y1 > rect.draw.y2 ? rect.draw.y2 : rect.draw.y1;
                    let y_2 = rect.draw.y1 > rect.draw.y2 ? rect.draw.y1 : rect.draw.y2;
                    let x_L = x_2 - x_1;
                    let y_L = y_2 - y_1;
                    rect.draw.left -= (x_L + y_L);
                }
            }
        }
        else {
            rect.start();
        }
    };
    rect.area.onmousemove = function (e) {
        /* Set Temporary Values */
        rect.draw.tx = e.pageX - (rect.area.getBoundingClientRect().left + window.scrollX);
        rect.draw.ty = e.pageY - (rect.area.getBoundingClientRect().top + window.scrollY);
    };
    rect.paint = function () {
        /* Clear Canvas */
        rect.ctxt.clearRect(0, 0, rect.area.width, rect.area.height);

        /* Update Score */
        rect.draw.score = rect.draw.start ? Math.abs((new Date().getTime() - rect.draw.start.getTime())) : 0;

        /* Display Line Left */
        rect.ctxt.fillText("Line: " + (rect.draw.left > 0 ? rect.draw.left : 0), rect.area.width - 190, 35);

        /* Display Score */
        rect.ctxt.fillText("Score: " + rect.draw.score, 10, 35);

        /* Draw Rect (Mouse) */
        if (rect.draw.tx && rect.draw.ty) {
            if (!rect.draw.x1 && !rect.draw.y1 && !rect.draw.x1 && !rect.draw.y1) {
                rect.ctxt.fillRect(rect.draw.tx, rect.draw.ty, 5, 5);
            }
            else if (rect.draw.x1 && rect.draw.y1 && !rect.draw.x2 && !rect.draw.y2) {
                rect.ctxt.strokeRect(rect.draw.x1, rect.draw.y1, -(rect.draw.x1 - rect.draw.tx), -(rect.draw.y1 - rect.draw.ty));
            }
            else if (rect.draw.x1 && rect.draw.y1 && rect.draw.x2 && rect.draw.y2) {
                rect.ctxt.fillRect(rect.draw.tx, rect.draw.ty, 5, 5);
                rect.ctxt.fillRect(rect.draw.x1, rect.draw.y1, -(rect.draw.x1 - rect.draw.x2), -(rect.draw.y1 - rect.draw.y2));
            }
        }
        /* Draw Rect (Touch) */
        else {
            if (rect.draw.x1 && rect.draw.y1 && !rect.draw.x2 && !rect.draw.y2) {
                rect.ctxt.fillRect(rect.draw.x1, rect.draw.y1, 5, 5);
            }
            else if (rect.draw.x1 && rect.draw.y1 && rect.draw.x2 && rect.draw.y2) {
                rect.ctxt.fillRect(rect.draw.x1, rect.draw.y1, -(rect.draw.x1 - rect.draw.x2), -(rect.draw.y1 - rect.draw.y2));
            }
        }

        /* Draw Ball */
        if (rect.ball.count % rect.ball.speed === 0) {
            /* Direction Up-Left */
            if (!rect.ball.mx && !rect.ball.my) {
                rect.ball.x -= rect.ball.step;
                rect.ball.y -= rect.ball.step;
            }
            /* Direction Up-Right */
            else if (rect.ball.mx && !rect.ball.my) {
                rect.ball.x += rect.ball.step;
                rect.ball.y -= rect.ball.step;
            }
            /* Direction Down-Left */
            else if (!rect.ball.mx && rect.ball.my) {
                rect.ball.x -= rect.ball.step;
                rect.ball.y += rect.ball.step;
            }
            /* Direction Down-Right */
            else {
                rect.ball.x += rect.ball.step;
                rect.ball.y += rect.ball.step;
            }
        }

        rect.ctxt.beginPath();
        rect.ctxt.arc(rect.ball.x, rect.ball.y, rect.ball.w, 0, 2 * Math.PI);
        rect.ctxt.closePath();
        rect.ctxt.fill();

        /* Check for Collision */
        if (rect.draw.x1 && rect.draw.y1 && rect.draw.x2 && rect.draw.y2) {
            let x_1 = rect.draw.x1 > rect.draw.x2 ? rect.draw.x2 : rect.draw.x1;
            let x_2 = rect.draw.x1 > rect.draw.x2 ? rect.draw.x1 : rect.draw.x2;
            let y_1 = rect.draw.y1 > rect.draw.y2 ? rect.draw.y2 : rect.draw.y1;
            let y_2 = rect.draw.y1 > rect.draw.y2 ? rect.draw.y1 : rect.draw.y2;
            let mx_1 = x_1 - rect.ball.w;
            let mx_2 = x_2 - rect.ball.w;
            let my_1 = y_1 - rect.ball.w;
            let my_2 = y_2 - rect.ball.w;
            let nx_1 = x_1 + rect.ball.w;
            let nx_2 = x_2 + rect.ball.w;
            let ny_1 = y_1 + rect.ball.w;
            let ny_2 = y_2 + rect.ball.w;

            /* Direction Up-Left */
            if (!rect.ball.mx && !rect.ball.my) {
                if (nx_1 <= rect.ball.x && nx_2 >= rect.ball.x && ny_1 <= rect.ball.y && ny_2 >= rect.ball.y) {
                    let fromX = rect.ball.x - nx_2;
                    let fromY = rect.ball.y - ny_2;
                    if (fromX < fromY) {
                        rect.ball.my = true;
                    }
                    else {
                        rect.ball.mx = true;
                    }
                }
            }
            /* Direction Up-Right */
            else if (rect.ball.mx && !rect.ball.my) {
                if (mx_1 <= rect.ball.x && mx_2 >= rect.ball.x && ny_1 <= rect.ball.y && ny_2 >= rect.ball.y) {

                    let fromX = rect.ball.x - mx_1;
                    let fromY = rect.ball.y - my_1;
                    if (fromX < fromY) {
                        rect.ball.my = false;
                        rect.ball.mx = false;
                    }
                    else {
                        rect.ball.my = true;
                        rect.ball.mx = true;
                    }
                }
            }
            /* Direction Down-Left */
            else if (!rect.ball.mx && rect.ball.my) {
                if (nx_1 <= rect.ball.x && nx_2 >= rect.ball.x && my_1 <= rect.ball.y && my_2 >= rect.ball.y) {

                    let fromX = rect.ball.x - mx_1;
                    let fromY = rect.ball.y - my_1;
                    if (fromX > fromY) {
                        rect.ball.my = false;
                        rect.ball.mx = false;
                    }
                    else {
                        rect.ball.my = true;
                        rect.ball.mx = true;
                    }
                }
            }
            /* Direction Down-Right */
            else if (rect.ball.mx && rect.ball.my) {
                if (mx_1 <= rect.ball.x && mx_2 >= rect.ball.x && my_1 <= rect.ball.y && my_2 >= rect.ball.y) {
                    let fromX = rect.ball.x - mx_1;
                    let fromY = rect.ball.y - my_1;
                    if (fromX > fromY) {
                        rect.ball.my = false;
                    }
                    else {
                        rect.ball.mx = false;
                    }
                }
            }
        }

        /* Check for Ball Overflow */
        if (rect.ball.x < 0 || rect.ball.y < 0 || rect.ball.x > rect.area.width || rect.ball.y > rect.area.height) {
            rect.stop();
        }

        rect.ball.count++;
    };
    rect.init();
};