﻿angular.module('muep')
.factory('newEventToAdd', function () {
    return {
        email: '',
        eventHost: '',
        eventName: '',
        eventCategory: '',
        eventStart: '',
        eventEnd: '',
        eventAddress: '',
        eventAddressLat: '',
        eventAddressLng: '',
        eventNote: '',
        eventEmail: '',
        id: ''
    };
})
.factory('storageArray', function () {
    return function (l, o, a, d) {
        var x = d.trim().toLowerCase();
        if (x == 'set') {
            localStorage.removeItem(l);
            localStorage.setItem(l, JSON.stringify(o));
            return JSON.parse(localStorage.getItem(l)) || [];
        }
        else {
            if (x == 'add') {
                if (localStorage.getItem(l) == null) {
                    localStorage.setItem(l, JSON.stringify(o));
                }
                else {
                    if (Array.isArray(a) == true) {
                        var c = JSON.parse(localStorage.getItem(l)) || [];
                        for (i = 0; i < a.length; i++) {
                            c.push(a[i]);
                        };
                        localStorage.setItem(l, JSON.stringify(c));
                        return JSON.parse(localStorage.getItem(l)) || [];
                    }
                    else {
                        var c = JSON.parse(localStorage.getItem(l)) || [];
                        c.push(a);
                        localStorage.setItem(l, JSON.stringify(c));
                        return JSON.parse(localStorage.getItem(l)) || [];
                    };
                };
            }
            else {
                return JSON.parse(localStorage.getItem(l)) || [];
            };
        };
    };
})
.factory('getLatLng', [function () {
    return function (a, newEventToAdd) {
        var url = 'http://maps.googleapis.com/maps/api/geocode/json?address=' + a + '&sensor=false';
        var obj = {
            lat: '',
            lng: ''
        };
        $.getJSON(url, function (data) { }).success(function (data) {
            obj.lat = data.results[0].geometry.location.lat;
            obj.lng = data.results[0].geometry.location.lng;
            newEventToAdd.eventAddressLat = obj.lat;
            newEventToAdd.eventAddressLng = obj.lng;
        }).error(function () {
            obj.lat = 'f';
            obj.lng = 'f'
        });
        return obj
    };
}])
.factory('ner', function () {
    return {
        r: 'n'
    };
})
.controller('muepStartCtrl', function ($scope, $http, $location, $rootScope, $timeout, $route, $routeParams, ngDialog, logins, newEventToAdd, getLatLng, words, ner, storageArray) {
    if (typeof $scope.words == 'undefined') {
        storageArray('t', logins.events, '', 'set');
        String.prototype.replaceAll = function (str1, str2, ignore) {
            return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), (ignore ? "gi" : "g")), (typeof (str2) == "string") ? str2.replace(/\$/g, "$$$$") : str2);
        };
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        $scope.words = words;
        $scope.newEventToAdd = newEventToAdd;
        $scope.isVisible = false;
        $scope.isVisiblemapframe = false;
        $scope.isVisiblenoevent = false;
        $scope.newEvent = function () {
            if ($scope.isVisiblemapframe == true) {
                $scope.isVisiblemapframe = !$scope.isVisiblemapframe;
                $scope.loadedmapframe = { display: 'block' };
            };
            if ($scope.isVisibleEvents == true) {
                $scope.isVisibleEvents = !$scope.isVisibleEvents;
                $scope.loadedevents = { display: 'block' };
            };
            if ($scope.isVisible == false) {
                $('#eventHost').val('');
                $('#eventName').val('');
                $('#eventCategory').val('');
                $('#eventAddress').val('');
                $('#eventEmail').val('');
                $('#eventEmail').val('');
                $('#eventNote').val('');
                $scope.isVisible = !$scope.isVisible;
                $scope.loaded = { display: 'block' };
                $timeout(function () { $('#eventHost').focus(); });
            }
            else {
                $timeout(function () { $('#eventHost').blur(); });
                ngDialog.closeAll();
                $('#eventHost').val('');
                $('#eventName').val('');
                $('#eventCategory').val('');
                $('#eventAddress').val('');
                $('#eventEmail').val('');
                $('#eventEmail').val('');
                $('#eventNote').val('');
                $scope.isVisible = !$scope.isVisible;
                $scope.loaded = { display: 'block' };
                
            };
            
        };
        $scope.newEventToAdd.firstName = logins.firstName;
        $scope.newEventToAdd.lastName = logins.lastName;
        $scope.newEventToAdd.email = logins.email;
        $scope.newEntryEvent = function (e, w) {
            ner.r = 'n';
            w[e.currentTarget.id].v = e.currentTarget.value.trim();
            $scope.newEventToAdd[e.currentTarget.id] = e.currentTarget.value.trim();
            if ((ngDialog.getOpenDialogs()).length === 0) {
                if (e.currentTarget.value == '') {
                    var elem = '#' + e.currentTarget.id;
                    var dialog = ngDialog.open({
                        template: '<h3 style="color:red;text-align:center"><b>' + logins.firstName + ' ' + w[e.currentTarget.id].r + '</b></h3>',
                        plain: true,
                        closeByDocument: false,
                        closeByEscape: false
                    });
                    setTimeout(function () {
                        dialog.close();
                    }, w.windowTimeOpen);
                }
                else {
                    ngDialog.close((ngDialog.getOpenDialogs())[0]);
                    if (e.currentTarget.id == 'eventAddress') {
                        if (w[e.currentTarget.id].v.indexOf(' ') == -1 || w[e.currentTarget.id].v.indexOf(',') == -1 || w[e.currentTarget.id].v.match(/\d+/g) == null) {
                            words.addressMessage.h = false;
                        };
                    };
                };
            };
        };
        var in3Days = new Date();
        in3Days.setDate(in3Days.getDate() + 3);
        var in2Days = new Date();
        in2Days.setDate(in2Days.getDate() + 2);
        $scope.calendarDates = {
            dateStart: in2Days,
            dateEnd: in3Days
        };
        $scope.calendarIsOpenStart = { date: false };
        $scope.calendarIsOpenEnd = { date: false };
        $scope.openCalendarStart = function (e, date) { $scope.calendarIsOpenStart[date] = true; };
        $scope.openCalendarEnd = function (e, date) { $scope.calendarIsOpenEnd[date] = true; };
        $scope.registerEvent = function (e) {
            $scope.newEventToAdd.eventStart = $('#eventStart').val();
            $scope.newEventToAdd.eventEnd = $('#eventEnd').val();
            if ($scope.newEventToAdd.eventHost == '') {
                ngDialog.closeAll();
                var dialog = ngDialog.open({
                    template: '<h3 style="color:red;text-align:center"><b>' + logins.firstName + ' ' + words.eventHost.r + '</b></h3>',
                    plain: true,
                    closeByDocument: false,
                    closeByEscape: false
                });
                setTimeout(function () {
                    dialog.close();
                }, words.windowTimeOpen);
            }
            else {
                if ($scope.newEventToAdd.eventName == '') {
                    ngDialog.closeAll();
                    var dialog = ngDialog.open({
                        template: '<h3 style="color:red;text-align:center"><b>' + logins.firstName + ' ' + words.eventName.r + '</b></h3>',
                        plain: true,
                        closeByDocument: false,
                        closeByEscape: false
                    });
                    setTimeout(function () {
                        dialog.close();
                    }, words.windowTimeOpen);
                }
                else {
                    if ($scope.newEventToAdd.eventCategory == '') {
                        ngDialog.closeAll();
                        var dialog = ngDialog.open({
                            template: '<h3 style="color:red;text-align:center"><b>' + logins.firstName + ' ' + words.eventCategory.r + '</b></h3>',
                            plain: true,
                            closeByDocument: false,
                            closeByEscape: false
                        });
                        setTimeout(function () {
                            dialog.close();
                        }, words.windowTimeOpen);
                    }
                    else {
                        if ($scope.newEventToAdd.eventAddress == '') {
                            ngDialog.closeAll();
                            var dialog = ngDialog.open({
                                template: '<h3 style="color:red;text-align:center"><b>' + logins.firstName + ' ' + words.eventAddress.r + '</b></h3>',
                                plain: true,
                                closeByDocument: false,
                                closeByEscape: false
                            });
                            setTimeout(function () {
                                dialog.close();
                            }, words.windowTimeOpen);
                        }
                        else {
                            if ($scope.newEventToAdd.eventStart == '') {
                                ngDialog.closeAll();
                                var dialog = ngDialog.open({
                                    template: '<h3 style="color:red;text-align:center"><b>' + logins.firstName + ' ' + words.eventStart.r + '</b></h3>',
                                    plain: true,
                                    closeByDocument: false,
                                    closeByEscape: false
                                });
                                setTimeout(function () {
                                    dialog.close();
                                }, words.windowTimeOpen);
                            }
                            else {
                                if ($scope.newEventToAdd.eventEnd == '') {
                                    ngDialog.closeAll();
                                    var dialog = ngDialog.open({
                                        template: '<h3 style="color:red;text-align:center"><b>' + logins.firstName + ' ' + words.eventEnd.r + '</b></h3>',
                                        plain: true,
                                        closeByDocument: false,
                                        closeByEscape: false
                                    });
                                    setTimeout(function () {
                                        dialog.close();
                                    }, words.windowTimeOpen);
                                }
                                else {
                                    if ($scope.newEventToAdd.eventEmail == '') {
                                        ngDialog.closeAll();
                                        var dialog = ngDialog.open({
                                            template: '<h3 style="color:red;text-align:center"><b>' + logins.firstName + ' ' + words.eventEmail.r + '</b></h3>',
                                            plain: true,
                                            closeByDocument: false,
                                            closeByEscape: false
                                        });
                                        setTimeout(function () {
                                            dialog.close();
                                        }, words.windowTimeOpen);
                                    }
                                    else {
                                        if (ner.r == 'n') {
                                            ner.r = 'y';
                                            if (newEventToAdd.eventNote == '') {
                                                newEventToAdd.eventNote = 'None';
                                            };
                                            newEventToAdd.idX = 'id' + ((storageArray('t', logins.events, newEventToAdd, 'get')).length).toString();
                                            storageArray('t', logins.events, newEventToAdd, 'add');
                                            logins.events = storageArray('t', logins.events, newEventToAdd, 'get');
                                            /// Remove here
                                            $scope.isVisible = !$scope.isVisible;
                                            $scope.loaded = { display: 'block' };
                                        }
                                        else {

                                        };
                                    };

                                };
                            };
                        };
                    };
                };
            };
        };
        $scope.getLatLng = function (e) {
            $scope.newEventToAdd[e.currentTarget.id] = e.currentTarget.value;
            if (e.currentTarget.value != '') {
                if (e.currentTarget.value.indexOf(' ') > 0 && e.currentTarget.value.indexOf(',') > 0) {
                    var r = getLatLng(e.currentTarget.value, $scope.newEventToAdd);
                };
            };
        };
        $scope.checkEvents = function () {
            if ($scope.isVisible == true) {
                $scope.isVisible = !$scope.isVisible;
                $scope.loaded = { display: 'none' };
            };
            if ($scope.isVisibleEvents == true) {
                $scope.isVisibleEvents = !$scope.isVisibleEvents;
                $scope.loadedevents = { display: 'none' };
            };
            if (typeof $scope.googleMap == 'undefined') {
                function isEven(n) {
                    return n == parseFloat(n) ? !(n % 2) : void 0;
                };
                $scope.w = $('#mapHolder').width();
                $scope.h = Math.round((screen.height * 0.6), 0);
                $scope.googleMap = function () {
                    var infowindow;
                    var zmlvl = 9;
                    var places = [];
                    $scope.filterPlaces = function (p) {
                        var pp = p;
                        var temppp = [];
                        pp.sort(function (a, b) {
                            if (a.eventAddressLat > b.eventAddressLat) {
                                return 1;
                            }
                            if (a.eventAddressLat < b.eventAddressLat) {
                                return -1;
                            }
                            return 0;
                        });
                        var d = new Date();
                        for (i = 0; i < pp.length; i++) {
                            var de = new Date(pp[i].eventEnd);
                            if (pp[i].eventAddressLat == '' || pp[i].eventAddressLng == '') {
                            }
                            else {
                                temppp.push(pp[i]);
                                var currentLat = pp[i].eventAddressLat;
                                var currentLng = pp[i].eventAddressLng;
                                var futureLat;
                                var futureLng;
                                if (i == pp.length - 1) {

                                }
                                else {
                                    futureLat = pp[i + 1].eventAddressLat;
                                    futureLng = pp[i + 1].eventAddressLng;
                                    if (currentLat == futureLat) {
                                        var newLat = ((pp[i].eventAddressLat).toString()).substring(0, ((pp[i].eventAddressLat).toString()).length - 2);
                                        var newLng = ((pp[i].eventAddressLng).toString()).substring(0, ((pp[i].eventAddressLng).toString()).length - 2);
                                        var newLatAdd = newLat + getRandomInt(i + 1, i + 12).toString();
                                        var newLngAdd = newLng + getRandomInt(i + 1, i + 12).toString();
                                        temppp[temppp.length - 1].eventAddressLat = newLatAdd;
                                        temppp[temppp.length - 1].eventAddressLng = newLngAdd;
                                    };
                                };
                            };
                        };
                        return temppp;
                    };
                    logins.filteredEvents = $scope.filterPlaces(logins.events);
                    places = logins.filteredEvents;
                    var startlocation = new google.maps.LatLng(places[0].eventAddressLat, places[0].eventAddressLng);
                    var options = {
                        zoom: zmlvl,
                        center: startlocation,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    var mapDiv = document.getElementById('googleMap');
                    var map = new google.maps.Map(mapDiv, options);
                    var bounds = new google.maps.LatLngBounds();
                    var c = places.length;
                    function removeTabs() {
                        for (var i = 0; i < 3; i++) {
                            tabexists = 1;
                            infowindow.removeTab(i);
                        }
                    };
                    google.maps.event.addListener(map, 'click', function () {
                        if (typeof infowindow.close() != 'undefined') {
                            infowindow.close();
                            removeTabs();

                        };
                    });
                    for (var i = 0; i < c; i++) {
                        var tabexists = 1;
                        position = new google.maps.LatLng(places[i].eventAddressLat, places[i].eventAddressLng);
                        marker = new google.maps.Marker({
                            position: position,
                            map: map,
                            title: places[i].eventName.replaceAll("'", "\'"),
                            animation: google.maps.Animation.DROP
                        });
                        (function (i, marker) {
                            google.maps.event.addListener(marker, 'click', function () {
                                if (!infowindow) {
                                    infowindow = new InfoBubble(
                   {
                       map: map,
                       position: position,
                       shadowStyle: 1,
                       padding: 15,
                       backgroundColor: '#D8D8D8',
                       borderRadius: 15,
                       borderWidth: 1,
                       borderColor: '#2c2c2c',
                       disableAutoPan: false,
                       disableAnimation: true,
                       hideCloseButton: false,
                       arrowPosition: 50,
                       arrowSize: 15,
                       arrowStyle: 2,
                       maxWidth: 350,
                       minWidth: 250,
                       maxHeight: 350,
                       minHeight: 250,
                   });
                                };
                                var content1 = '<div><p><font size="3" color="red"><center>' + places[i].eventName.replaceAll("'", "\'") + '</center></font></p><p><font size="2" color="black"><center><b>Host: </b><a>' + places[i].eventHost.replaceAll("'", "\'") + '</a></center></font></p><p><font size="2" color="black"><center><b>Starts: </b><a>' + places[i].eventStart + '</a></center></font></p><p><font size="2" color="black"><center><b>Ends: </b><a>' + places[i].eventEnd + '</a></center></font></p><p><font size="2" color="black"><center><b>Address: </b><a>' + places[i].eventAddress.replaceAll('|', ',') + '</a></center></font></p></div>';
                                var content2 = '<div><p><font size="2" color="black"><center><b>Notes: </b><a>' + places[i].eventNote.replaceAll("'", "\'") + '</a></center></font></p><p><font size="2" color="black"><center><b>Organizer: </b><a>' + places[i].firstName + ' ' + places[i].lastName + '</a></center></font></p><p><font size="2" color="black"><center><b>If you have questions email: </b><a>' + places[i].email + '</a></center></font></p></div>';
                                var info1Name = 'General information';
                                var info2Name = 'Additional info'
                                removeTabs();
                                if (tabexists == 1) {
                                    tabexists = 0;
                                    removeTabs();
                                    infowindow.close(info1Name, content1);
                                    infowindow.close(info2Name, content2);
                                    infowindow.addTab(info1Name, content1);
                                    infowindow.addTab(info2Name, content2);
                                }
                                else {
                                    tabexists = 1;
                                    infowindow.removeTab(info1Name, content1);
                                    infowindow.removeTab(info2Name, content2);
                                };
                                infowindow.open(map, marker);
                                var position1 = new google.maps.LatLng(places[i].eventAddressLat, places[i].eventAddressLng);
                                map.setCenter(position1);
                                map.setZoom(zmlvl + 2);
                                google.maps.event.addListener(infowindow, 'closeclick', function () {
                                    infowindow.close(info1Name, content1);
                                    infowindow.close(info2Name, content2);
                                    infowindow.close();
                                    removeTabs();
                                    map.fitBounds(bounds);
                                });
                            });
                        })
                               (i, marker);
                        bounds.extend(position);
                    };
                    map.fitBounds(bounds)
                };
                $scope.googleMap();
                $scope.isVisiblemapframe = !$scope.isVisiblemapframe;
                $scope.loadedmapframe = { display: 'block' };
            }
            else {
                $scope.isVisiblemapframe = !$scope.isVisiblemapframe;
                $scope.loadedmapframe = { display: 'block' };
                if ($scope.isVisiblemapframe == false) {
                    $timeout($scope.googleMap(), 2000);
                };
            };
        };
        $scope.listEvents = function () {
            if ($scope.isVisible == true) {
                $scope.isVisible = !$scope.isVisible;
                $scope.loaded = { display: 'none' };
            };
            if ($scope.isVisiblemapframe == true) {
                $scope.isVisiblemapframe = !$scope.isVisiblemapframe;
                $scope.loadedmapframe = { display: 'none' };
            };
            $scope.fe = logins.events;
            $scope.isVisibleEvents = !$scope.isVisibleEvents;
            $scope.loadedevents = { display: 'block' };
        };
    };
})
.directive('events', function () {
    return {
        restrict: 'AEC',
        templateUrl: 'Directives/events.html'
    };
})
.directive('newevent', function () {
    return {
        restrict: 'AEC',
        templateUrl: 'Directives/newevent.html'
    };
})
.directive('mapframe', function () {
    return {
        restrict: 'AEC',
        templateUrl: 'Directives/mapframe.html'
    };
})
.directive("bnSlideShow", function () {
    function link($scope, element, attributes) {
        var expression = attributes.bnSlideShow;
        var duration = (attributes.slideShowDuration || "fast");
        if (!$scope.$eval(expression)) { element.hide(); }
        $scope.$watch(expression, function (newValue, oldValue) {
            if (newValue === oldValue) { return; }
            if (newValue) {
                element.stop(true, true).slideDown(duration);
            } else { element.stop(true, true).slideUp(duration); }
        });
    };
    return ({ link: link, restrict: "A" });
});