define(['require', 'exports', 'module', 'watcher', 'dynamics', 'Waves'], function (require, exports, module, watcher, dynamics, Waves) {
    'use strict';

    var L = module.exports,
        btn = watcher.$$("unlock"),
        input = watcher.$$('ls-input'),
        password = input.querySelector("input"),
        info = input.querySelector("p");


    L.init = () => {
        dom();
    }


    function updateTime(){

    }
    function btn_hide() {
        dynamics.animate(btn, {
            translateX: 60,
            opacity: 0,
            scaleY: .01
        }, {
            duration: 500,
            type: dynamics.easeInOut,
            friction: 100

        });
    }

    function btn_show() {
        dynamics.animate(btn, {
            translateX: 0,
            opacity: 1,
            scaleY: 1
        }, {
            duration: 500,
            type: dynamics.easeOut,
            friction: 1
        });
    }

    function input_hide() {
        dynamics.animate(input, {
            translateY: 0,
            opacity: 0
        }, {
            duration: 1200,
            type: dynamics.spring,
        });
    }

    function input_show() {
        dynamics.animate(input, {
            translateY: -125,
            opacity: 1
        }, {
            duration: 1200,
            type: dynamics.spring,
        });
    }


    function lockScreen() {
        var thescreen = document.getElementsByClassName("locker-main")[0];
        dynamics.animate(thescreen, {
            translateY: 0
        }, {
            type: dynamics.spring,
            duration: 1500,
            friction: 400
        })
    }

    function unlockScreen() {

        var thescreen = document.getElementsByClassName("locker-main")[0];

        dynamics.animate(thescreen, {
                translateY: "125vh"
            }, {
                type: dynamics.bezier,
                duration: 1500,
                points: [{
                    "x": 0,
                    "y": 0,
                    "cp": [{
                        "x": 0.379,
                        "y": 0.936
                    }]
                }, {
                    "x": 1,
                    "y": 1,
                    "cp": [{
                        "x": 0.416,
                        "y": 1.006
                    }]
                }]
            })
            // reset input & button
        dynamics.setTimeout(() => {
            btn_show();
            input_hide();
        }, 500);
        setTimeout(() => {
            watcher.trigger("initPage");
        });
    }


    function checkpassword(e) {
        if (!e.isTrusted) window.location.href = "fuckyoucheater";
        var value = e.target.value;
        if (e.keyCode == 13) {
            fetch("./api/lockpassword.json?pw=" + value)
                .then((resp) => resp.json())
                .then(function (json) {
                    if (json.ok) {
                        unlockScreen();
                        e.target.value = "";
                    } else {
                        dynamics.animate(password, {
                            translateX: 50
                        }, {
                            type: dynamics.bounce,
                            duration: 1300,
                        });
                    }
                }).catch(watcher.fetchERROR);


        }
    }

    function dom() {

        btn.addEventListener("click", () => {
            if (watcher.status.lockScreen) {
                btn_hide();
                input_show();
            } else {
                unlockScreen();
            }

        });

        btn_show();


        password.addEventListener("keydown", checkpassword);
        password.addEventListener("blur", () => {
            input_hide();
            btn_show();

        });
    }

    watcher.listen("lockScreen", lockScreen);

});
