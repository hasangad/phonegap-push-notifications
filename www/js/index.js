/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("resume", this.onResume, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        console.log('Received Device Ready Event');
        console.log('calling setup push');
        app.setupPush();
        app.DrawNotifications();
        app.TestAppend();
    },
    DrawNotifications: function(){
        if (localStorage.getItem("last") != null){
            var last = parseInt(localStorage.getItem("last"));
            var page = $(".page-content");
            
            for(var i = 0; i <= last; i++){
                var data = localStorage.getItem("notif" + i);
                data = JSON.parse(data);

                page.append('<div class="card-wide mdl-card mdl-shadow--2dp"><div class="mdl-card__title">'
                            + '<h2 class="mdl-card__title-text">' + data.title + '</h2></div>'
                            + '<div class="mdl-card__supporting-text">' + data.message + '</div></div>');
                page.trigger("create");
            }
        }
    },
    setupPush: function() {
        console.log('calling push init');
        var push = PushNotification.init({
            "android": {
                "senderID": "50492000753",
                "forceShow" : true,
                "vibrate" : true
            },
            "browser": {
                pushServiceURL : "https://console.firebase.google.com/project/notifrss/notification"
            },
            "ios": {
                "sound": true,
                "vibration": true,
                "badge": true
            },
            "windows": {}
        });
        console.log('after init');

        push.on('registration', function(data) {
            console.log('registration event: ' + data.registrationId);            

            var oldRegId = localStorage.getItem('registrationId');
            if (oldRegId !== data.registrationId) {
                // Save new registration ID
                localStorage.setItem('registrationId', data.registrationId);
                // Post registrationId to your app server as the value has changed
            }

            // Show Snackbar
            var notification = document.querySelector('.mdl-js-snackbar');
            notification.MaterialSnackbar.showSnackbar(
            {
                message: 'Registrado'
            });
        });

        push.on('error', function(e) {
            console.log("push error = " + e.message);
        });

        push.on('notification', function(data) {
            console.log('notification event');
            navigator.notification.alert(
                data.message,         // message
                null,                 // callback
                data.title,           // title
                'Ok'                  // buttonName
            );

            navigator.notification.alert(
                localStorage.getItem("last") == null,
                null,
                "Testing localStorage",
                'Ok'
            );

            if (localStorage.getItem("last") == null){
                localStorage.setItem("last", "0");
            }
            else{
                var last = parseInt(localStorage.getItem("last"));
                localStorage.setItem("last", (last++).toString())
            }

            var last = parseInt(localStorage.getItem("last"));
            localStorage.setItem("notif" + last, JSON.stringify(data));
       });
    },
    onResume: function(){
        var last = localStorage.getItem("last");
        console.log(typeof(last));
        console.log(last == null);
        console.log(last);
        // Show Snackbar
        var notification = document.querySelector('.mdl-js-snackbar');
        notification.MaterialSnackbar.showSnackbar(
        {
            message: last
        });

        app.DrawNotifications();
    },
    TestAppend: function(){
        console.log("Test Append - - - - - - ");
        var page = $(".page-content");
        page.append("<p>It works</p>");
        page.trigger("create");
    }
};


/*
var page = $(".page-content");

            page.append('<div class="card-wide mdl-card mdl-shadow--2dp"><div class="mdl-card__title">'
                    + '<h2 class="mdl-card__title-text">' + data.title + '</h2></div>'
                    + '<div class="mdl-card__supporting-text">' + data.message + '</div></div>');
*/