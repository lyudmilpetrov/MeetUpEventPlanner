angular.module('muep', ['ngRoute', 'ngDialog', 'ui.bootstrap', 'ui.bootstrap.datetimepicker', 'ngAnimate'])
.config(function ($routeProvider) {
    $routeProvider.when('/Login', {
        templateUrl: 'Views/Login.html',
        controller: 'muepCtrl'
    });
    $routeProvider.when('/Member', {
        templateUrl: 'Views/Member.html',
        controller: 'muepCtrl'
    });
    $routeProvider.when('/Start', {
        templateUrl: 'Views/Start.html',
        controller: 'muepStartCtrl'
    });
    $routeProvider.otherwise({
        templateUrl: 'Views/Login.html',
        controller: 'muepCtrl'
    });
})
.factory('returnElementID', [function () {
    return function (event) {
        return '#' + event.target.id;
    }
}])
.factory('logins', function () {
    return {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordRules: 'no',
        emailExistance: 'no',
        emailCode: 'invalid',
        emailAuthinticated: 'no',
        events: [{ 'email': 'ch_xxxx@gmail.com', 'eventHost': 'Sehee', 'eventName': 'Lyudmil\'s birthday', 'eventCategory': 'Birthday', 'eventStart': '02/09/2017 19:24', 'eventEnd': '02/10/2017 19:24', 'eventAddress': '3633 Gleneagle drive, Sarasota', 'eventAddressLat': 27.248195, 'eventAddressLng': -82.495323, 'eventNote': 'Ballantrae condo', 'eventEmail': 'Ljudmilpetrov79@gmail.com', 'idX': 'id0' },
            { 'email': 'lyudmilpetrov79@gmail.com', 'eventHost': 'Lyudmil', 'eventName': 'Casual party', 'eventCategory': 'Party', 'eventStart': '10/09/2016 12:29', 'eventEnd': '10/10/2016 12:29', 'eventAddress': '222 S. Osprey ave, Sarasota, FL 34236', 'eventAddressLat': 27.33461, 'eventAddressLng': -82.53475999999999, 'eventNote': 'Outside in front of the condo', 'eventEmail': 'xxxxxxx@email.com; hgfjggdfd@gmail.com; ljudmilpetrov79@gmail.com', 'idX': 'id1' }
        ]
    };
})
.factory('words', [function () {
    var engUSA = {
        fieldsMUEPMainLable1: { f: 'Meet up and event planner', r: '', v: '', h: true },
        fieldsMUEPMainLable2: { f: 'Simple school demo', r: '', v: '', h: true },
        firstNameLogin: { f: 'First name', r: 'Please enter first name', v: '', h: true, i: 0 },
        lastNameLogin: { f: 'Last name', r: 'Please enter last name', v: '', h: true, i: 1 },
        emailLogin: { f: 'Email', r: 'Please enter email', v: '', h: true, i: 2 },
        emailLoginThumbs: { f: 'You will neeed an email: ', h: true },
        addressMessage: { f: 'To see this event on a map, you will need a real address', h: true },
        emailLoginPassword0: { f: 'Password', r: 'Please enter password', v: '', h: true, i: 3 },
        emailLoginPassword1: { f: 'Confirm password', r: 'Please confirm your password', v: '', h: true, i: 4 },
        letterCounter: { f: 'Minimum 8 characters', r: '', v: '', h: true },
        letterUL: { f: 'Mixture of upper and lower letters', r: '', v: '', h: true },
        letterNS: { f: 'At least one number and one special character', r: '', v: '', h: true },
        eventHost: { f: 'Event host', r: 'please enter event host', v: '', h: true, i: 5 },
        eventName: { f: 'Event name', r: 'please enter event name', v: '', h: true, i: 6 },
        eventCategory: { f: 'Event category (birthday, wedding, etc.)', r: 'please enter event category', v: '', h: true, i: 7 },
        eventAddress: { f: 'Address', r: 'please enter address', v: '', h: true, i: 8 },
        eventStart: { f: 'Event start date and time', r: 'please enter start time of the event', v: '', h: true, i: 9 },
        eventEnd: { f: 'Event end date and time', r: 'please enter end time of the event', v: '', h: true, i: 10 },
        eventNote: { f: 'Notes to the guests (such as location name, etc.)', r: 'please enter some notes to the gusets', v: '', h: true, i: 11 },
        eventEmail: { f: 'Guests list here separated by comma ', r: 'please enter your desired guests list', v: '', h: true, i: 12 },
        genericWords: {
            emailPasswordProblem: 'provided email and password do not match',
            emailConfirmation: 'enter the code that was sent to your email',
            usedEmail: 'strangely this email it has been already used', invalidEmail: 'the email is not valid', connectionIssue: 'problem with the connection try again', passwordRulls: 'please follow password rules', passwordMatch: 'please match the password', takenEmailChange: 'the email is already taken: ', tmbsPerfect: 'Perfect: ', tmbsEmailEmpty: 'You will neeed an email: ', tmbsTakenEmail: 'Taken email: ', tmbsInvalidEmail: 'Invalid email: ', invalidAddress: 'please enter valid address',
            invitationSent: 'the invitation is on its way', noevents: 'you have no scheduled event(s)', emailForInvitation: 'please enter real email(s), you will need that in order invitation to be sent',
            imitateEmail: 'At least try to imitate email :), by adding  @ and dot signs',
            passwordRulls: 'Password rulls: '
        },
        buttons: { cancel: 'Cancel', confirm: 'Confirm', signUp: 'Sign up', signIn: 'Sign in', welcome: 'Welcome', newEvent: 'New Event', checkEvent: 'Event(s) on map', registerEvent: 'Register event', listEvent: 'List event(s)' },
        windowTimeOpen: 1150,
        views: ''
    }
    return engUSA;
}])
.controller('muepCtrl', function ($scope, $http, $location, $rootScope, $timeout, $route, ngDialog, logins, returnElementID, words) {
    $scope.changeView = function (view) { $location.url(view); };
    if (typeof $scope.words == 'undefined') {
        $scope.words = words;
        $scope.newEntry = function (e, w) {
            w[e.currentTarget.id].v = e.currentTarget.value.trim();
            if ((ngDialog.getOpenDialogs()).length === 0) {
                if (e.currentTarget.value == '') {
                    var elem = '#' + e.currentTarget.id;
                    if (e.currentTarget.id == 'firstNameLogin') { }
                    else {
                        var dialog = ngDialog.open({
                            template: '<h3 style="color:red;text-align:center"><b>' + w[e.currentTarget.id].r + '</b></h3>',
                            plain: true,
                            closeByDocument: false,
                            closeByEscape: false
                        });
                        setTimeout(function () {
                            dialog.close();
                        }, w.windowTimeOpen);
                    };
                }
                else {
                    ngDialog.close((ngDialog.getOpenDialogs())[0]);
                    Object.keys(obj = w).forEach(function (key, index) {
                        if (index < 5) {
                            if (key == e.currentTarget.id) {
                                var nextIndex = index + 1;
                                var nextKey = Object.keys(obj)[nextIndex];
                            };
                        };
                    });
                };
            };
        };
        $scope.checkUserEmailExistance = function (e, w) {
            w[e.currentTarget.id].v = e.currentTarget.value;
            var emailStr = w[e.currentTarget.id].v;
            if (emailStr.indexOf('@') > 0 && emailStr.indexOf('.') > 0) {

            }
            else {
                if (emailStr == '') {
                    w['emailLoginThumbs'].f = w.genericWords.tmbsEmailEmpty;
                    w['emailLoginThumbs'].h = false;
                } else {
                    w['emailLoginThumbs'].f = w.genericWords.tmbsInvalidEmail;
                    w['emailLoginThumbs'].h = false;
                };
            };
        };
        $scope.checkPasswordMatch = function () {
            var up1 = $('#emailLoginPassword0').val();
            var up2 = $('#emailLoginPassword1').val();
            if (up1 !== up2) {
                var dialog = ngDialog.open({
                    template: '<h3 style="color:red;text-align:center"><b>Please match the password</b></h3>',
                    plain: true,
                    closeByDocument: false,
                    closeByEscape: false
                });
                setTimeout(function () {
                    dialog.close();
                }, words.windowTimeOpen);
            } else { logins.password = up1; };
        };
        $scope.consumePassword = function (event) {
            var e = returnElementID(event);
            var v = $(e).val();
            var validLL = new RegExp('[a-z]');
            var validCL = new RegExp('[A-Z]');
            var validNN = new RegExp('[0-9]');
            var validSC = new RegExp('[!@#$%^&*()]');
            if (v.length >= 8) {
                $('#letterCounter').attr('class', 'glyphicon glyphicon-ok-sign');
                $('#letterCounter').css('color', '#6ffb0f');
                if (v.match(validLL) && v.match(validCL)) {
                    $('#letterUL').attr('class', 'glyphicon glyphicon-ok-sign');
                    $('#letterUL').css('color', '#6ffb0f');
                    if (v.match(validSC) && v.match(validNN)) {
                        $('#letterNS').attr('class', 'glyphicon glyphicon-ok-sign');
                        $('#letterNS').css('color', '#6ffb0f');
                        logins.passwordRules = 'yes';
                    }
                    else {
                        $('#letterNS').attr('class', 'glyphicon glyphicon-exclamation-sign');
                        $('#letterNS').css('color', '#be1313');
                        logins.passwordRules = 'no';
                    };
                }
                else {
                    $('#letterUL').attr('class', 'glyphicon glyphicon-exclamation-sign');
                    $('#letterUL').css('color', '#be1313');
                    logins.passwordRules = 'no';
                };
            }
            else {
                logins.passwordRules = 'no';
                $('#letterCounter').attr('class', 'glyphicon glyphicon-exclamation-sign');
                $('#letterCounter').css('color', '#be1313');
                $('#letterNS').attr('class', 'glyphicon glyphicon-exclamation-sign');
                $('#letterNS').css('color', '#be1313');
                $('#letterUL').attr('class', 'glyphicon glyphicon-exclamation-sign');
                $('#letterUL').css('color', '#be1313');
            };
        };
        $scope.addNewUser = function () {
            logins.firstName = words.firstNameLogin.v;
            logins.lastName = words.lastNameLogin.v;
            if (logins.firstName === '') {
                var dialog = ngDialog.open({
                    template: '<h3 style="color:red;text-align:center"><b>' + words.firstNameLogin.r + '</b></h3>',
                    plain: true,
                    closeByDocument: false,
                    closeByEscape: false
                });
                setTimeout(function () {
                    dialog.close();
                }, words.windowTimeOpen);

            }
            else {
                if (logins.lastName === '') {
                    var dialog = ngDialog.open({
                        template: '<h3 style="color:red;text-align:center"><b>' + words.lastNameLogin.r + '</b></h3>',
                        plain: true,
                        closeByDocument: false,
                        closeByEscape: false
                    });
                    setTimeout(function () {
                        dialog.close();
                    }, words.windowTimeOpen);

                }
                else {
                    if (logins.emailExistance === 'yes') {
                        var dialog = ngDialog.open({
                            template: '<h3 style="color:red;text-align:center"><b>' + words.genericWords.takenEmailChange + '</b></h3>',
                            plain: true,
                            closeByDocument: false,
                            closeByEscape: false
                        });
                        setTimeout(function () {
                            dialog.close();
                        }, words.windowTimeOpen);
                    }
                    else {
                        var up1 = $('#emailLoginPassword0').val();
                        var up2 = $('#emailLoginPassword1').val();
                        if (up1 !== up2) {
                            var dialog = ngDialog.open({
                                template: '<h3 style="color:red;text-align:center"><b>' + words.genericWords.passwordMatch + '</b></h3>',
                                plain: true,
                                closeByDocument: false,
                                closeByEscape: false
                            });
                            setTimeout(function () {
                                dialog.close();
                            }, words.windowTimeOpen);
                        }
                        else {
                            if (logins.passwordRules === 'no') {
                                var dialog = ngDialog.open({
                                    template: '<h3 style="color:red;text-align:center"><b>' + words.genericWords.passwordRulls + '</b></h3>',
                                    plain: true,
                                    closeByDocument: false,
                                    closeByEscape: false
                                });
                                setTimeout(function () {
                                    dialog.close();
                                }, words.windowTimeOpen);
                            }
                            else {
                                logins.password = up1;
                                $scope.changeView('/Start');
                            };
                        };
                    };
                };
            };
        };
        $scope.signIn = function () {
            $('#emailLogon').focus();
            words.views = 's';
            $scope.changeView('/Member');
            $timeout(function () { $('#emailLogon').focus(); });
            $('#emailLogon').focus();
        };
        $scope.checkEmailIfReal = function () {
            var emailStr = $('#emailLogon').val();
            if (emailStr.indexOf('@') > 0 && emailStr.indexOf('.') > 0) {
                logins.email = emailStr;
            }
            else {
                logins.email = '';
                var dialog = ngDialog.open({
                    template: '<h3 style="color:red;text-align:center"><b>The email is not valid</b></h3>',
                    plain: true,
                    closeByDocument: false,
                    closeByEscape: false
                });
                setTimeout(function () {
                    dialog.close();
                }, words.windowTimeOpen);
            };
        };
        $scope.LogOn = function () {
            logins.email = $('#emailLogon').val();
            if (logins.email.indexOf('@') > 0 && logins.email.indexOf('.') > 0) {
                var v = $('#emailLogonPassword0').val();
                var validLL = new RegExp('[a-z]');
                var validCL = new RegExp('[A-Z]');
                var validNN = new RegExp('[0-9]');
                var validSC = new RegExp('[!@#$%^&*()]');
                if (v.length >= 8) {
                    $('#letterCounter').attr('class', 'glyphicon glyphicon-ok-sign');
                    $('#letterCounter').css('color', '#6ffb0f');
                    if (v.match(validLL) && v.match(validCL)) {
                        $('#letterUL').attr('class', 'glyphicon glyphicon-ok-sign');
                        $('#letterUL').css('color', '#6ffb0f');
                        if (v.match(validSC) && v.match(validNN)) {
                            $('#letterNS').attr('class', 'glyphicon glyphicon-ok-sign');
                            $('#letterNS').css('color', '#6ffb0f');
                            $scope.changeView('/Start');
                        }
                        else {
                            $('#letterNS').attr('class', 'glyphicon glyphicon-exclamation-sign');
                            $('#letterNS').css('color', '#be1313');
                            $scope.passrullsLetterNS = false;
                        };
                    }
                    else {
                        $('#letterUL').attr('class', 'glyphicon glyphicon-exclamation-sign');
                        $('#letterUL').css('color', '#be1313');
                        $scope.passrullsLetterU = false;
                    };
                }
                else {
                    $('#letterCounter').attr('class', 'glyphicon glyphicon-exclamation-sign');
                    $('#letterCounter').css('color', '#be1313');
                    $('#letterNS').attr('class', 'glyphicon glyphicon-exclamation-sign');
                    $('#letterNS').css('color', '#be1313');
                    $('#letterUL').attr('class', 'glyphicon glyphicon-exclamation-sign');
                    $('#letterUL').css('color', '#be1313');
                    $scope.passrullsCounts = false;
                    $scope.passrullsLetterU = false;
                    $scope.passrullsLetterNS = false;
                };

            }
            else {
                logins.email = '';
                var dialog = ngDialog.open({
                    template: '<h3 style="color:red;text-align:center"><b>' + words.genericWords.imitateEmail + '</b></h3>',
                    plain: true,
                    closeByDocument: false,
                    closeByEscape: false
                });
                setTimeout(function () {
                    dialog.close();
                }, words.windowTimeOpen);
            };
        };
        $scope.passrullsCounts = true;
        $scope.passrullsLetterU = true;
        $scope.passrullsLetterNS = true;
        $timeout(function () { $('#firstNameLogin').focus(); });
    };
});