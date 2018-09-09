var app = angular.module('easter', []);

app.controller('EasterController', ['$scope', '$timeout', function($scope, $timeout)  {
    console.log("inside");

    var months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
    var letter = 'ABCDEFG';

    $scope.maths = 1;

    var a, b, c, d, e, g, h, m, j, k, l, n, p, y;

    var graph;

    var notes = [];
    if (typeof AudioContext !== "undefined") {
        var audioCtx = new AudioContext();
        var oscillator = audioCtx.createOscillator();
        oscillator.connect(audioCtx.destination);
        var playingNow = false;
    } else {
        var audioCtx, oscillator, playingNow = false;
    }
    $scope.jump = 1;

    $scope.findDay = function() {
        if ($scope.year < 0) {
            $scope.year = ($scope.year - 0) * -1;
        }

        whenIsEaster($scope.year);


        $scope.a = a;
        $scope.b = b;
        $scope.c = c;
        $scope.d = d;
        $scope.e = e;
        $scope.g = g;
        $scope.h = h;
        $scope.m = m;
        $scope.j = j;
        $scope.k = k;
        $scope.l = l;
        $scope.n = n;
        $scope.p = p;

        var ending = (p == 1 ? 'st' : (p == 2 ? 'nd' : (p == 3 ? 'rd' : 'th')));
        var future = (new Date(y + '-' + n + '-' + p)) > (new Date());
        $scope.future = (future ? 'will be' : 'was');

        $scope.epact = (23 - h > 0 ? 23 - h : 53 - h);
        $scope.dl = letter[(2*e + 2*j - k + 70) % 7];

        $scope.answer = p + ending + ' of ' + months[n-1] + ', ' + y;

        if ($scope.year > 50) {
            graph = [];
            var counter = 0;
            for (var i = $scope.year - 50; i < $scope.year + 50; ++i) {
                whenIsEaster(i);
                graph.push({
                    left: counter,
                    bottom: (n - 3)*30 + p,
                    year: i,
                    month: (n == 3 ? 'March' : 'April'),
                    day: p,
                    now: ($scope.year == i),
                    note: (n - 3)*30 + p - 21
                });

                ++counter;
            }
            
            $scope.easterGraph = graph;
        } else {
            $scope.easterGraph = false;
        }
    }

    $scope.showMaths = function() {

        $scope.maths = !$scope.maths;
    }

    $scope.play = function() {
        if (playingNow) {
            playingNow = false;
            oscillator.stop();
            return;
        } else {
            playingNow = true;
            oscillator.start();
            playSong(1);
        }
    }

    var playSong = function(i) {
        if (!playingNow) {
            return;
        }
        $timeout(function() {
            
            whenIsEaster(i);

            var pitch = notes[Math.floor(((n - 3)*30 + p - 21) / 3) % 8]
            oscillator.frequency.value = pitch;

            $scope.playYear = i;
            $scope.playPitch = pitch;

            playSong(i + (Number($scope.jump) > 0 ? $scope.jump : 3));
        }, 250);
    }

    var whenIsEaster = function(year) {
        y = year;

        a = y % 19;
        b = Math.floor(y / 100);
        c = y % 100;
        d = Math.floor(b / 4);
        e = b % 4;
        g = Math.floor((8*b + 13) / 25);
        h = (19*a + b - d - g + 15) % 30;
        m = Math.floor((a + 11*h) / 319);
        j = Math.floor(c / 4);
        k = c % 4;
        l = (2*e + 2*j + - k - h + m + 32) % 7;
        n = Math.floor((h - m + l + 90) / 25);
        p = (h - m + l + n + 19) % 32;
    }

    var defineNotes = function() {
        notes[0]  = 340; // A
        notes[1]  = notes[0]  * Math.pow(2, 1/12) * Math.pow(2, 1/12); // B
        notes[2]  = notes[1]  * Math.pow(2, 1/12);                     // C
        notes[3]  = notes[2]  * Math.pow(2, 1/12) * Math.pow(2, 1/12); // D
        notes[4]  = notes[3]  * Math.pow(2, 1/12) * Math.pow(2, 1/12); // E
        notes[5]  = notes[4]  * Math.pow(2, 1/12);                     // F
        notes[6]  = notes[5]  * Math.pow(2, 1/12) * Math.pow(2, 1/12); // G
        notes[7]  = notes[6]  * Math.pow(2, 1/12) * Math.pow(2, 1/12); // A
        notes[8]  = notes[7]  * Math.pow(2, 1/12) * Math.pow(2, 1/12); // B
        notes[9]  = notes[8]  * Math.pow(2, 1/12);                     // C
        notes[10] = notes[9]  * Math.pow(2, 1/12) * Math.pow(2, 1/12); // D
        notes[11] = notes[10] * Math.pow(2, 1/12) * Math.pow(2, 1/12); // E
        notes[12] = notes[11] * Math.pow(2, 1/12);                     // F
        notes[13] = notes[12] * Math.pow(2, 1/12) * Math.pow(2, 1/12); // G
        notes[14] = notes[13] * Math.pow(2, 1/12) * Math.pow(2, 1/12); // A
    }();

}]);