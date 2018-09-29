var app = angular.module('easter', []);

app.controller('EasterController', ['$scope', '$timeout', function($scope, $timeout)  {
    console.log("inside");

    var months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
    var letter = 'ABCDEFG';

    // letters for the algorithm
    var a, b, c, d, e, g, h, m, j, k, l, n, p, y;

    var graph;

    $scope.playingNow = false;
    $scope.jump = 1;
    $scope.maths = 1;
    $scope.Math = window.Math;


    var notes = [];
    if (typeof AudioContext !== "undefined") {
        var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        var oscillator = audioCtx.createOscillator();
        oscillator.connect(audioCtx.destination);
    } else {
        var audioCtx, oscillator = false;
    }

    $scope.findDay = function(customYear) {
        var year = customYear || $scope.year;

        if ($scope.year < 0) {
            $scope.year = ($scope.year - 0) * -1;
        }

        // calculate the variables a b c d e g h m j k l n p.
        whenIsEaster(year);

        // update the $scope.
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

        // make it look nice to the user
        var ending = (p == 1 ? 'st' : (p == 2 ? 'nd' : (p == 3 ? 'rd' : 'th')));
        var future = (new Date(y + '-' + n + '-' + p)) > (new Date());
        $scope.future = (future ? 'will be' : 'was');

        // calculate the last two special parameters
        $scope.epact = (23 - h > 0 ? 23 - h : 53 - h);
        $scope.dl = letter[(2*e + 2*j - k + 70) % 7];

        // humanise the date
        $scope.answer = p + ending + ' of ' + months[n-1] + ', ' + y;

    
        // populate the graph with 100 years. done every time... (TODO improve this)
        graph = [];
        var counter = 0;
        for (var i = year - 50; i < year + 50; ++i) {
            whenIsEaster(i);
            graph.push({
                left: counter,
                bottom: (n - 3)*30 + p,
                year: i,
                month: (n == 3 ? 'March' : 'April'),
                day: p,
                now: (year == i),
                note: (n - 3)*30 + p - 21,
                hidden: i <= 0
            });

            ++counter;
        }
        
        $scope.easterGraph = graph;
    }

    // show the maths or the explanation
    $scope.showMaths = function() {
        $scope.maths = !$scope.maths;
    }

    // play or stop the music
    $scope.play = function() {
        if ($scope.playingNow) {
            $scope.playingNow = false;
            oscillator.stop();

            // go back to the graph of the selected year, and empty other variables
            $timeout(function() {
                $scope.findDay();
                $scope.playYear = $scope.year;
                $scope.playPitch = 0;
            }, 400);
            return;
        } else {
            // this two lines are just in case the "year" field was empty.
            $scope.year = $scope.year || (new Date()).getFullYear();
            $scope.findDay($scope.year);
            //

            // mark playingNow variable as true
            $scope.playingNow = true;
            oscillator = audioCtx.createOscillator();
            oscillator.connect(audioCtx.destination);
            oscillator.start();
            playSong($scope.year);
        }
    }

    // generates the music by giving the notes every 250ms according to the Easter Sunday of that year.
    var playSong = function(i) {
        if (!$scope.playingNow) {
            return;
        }
        $timeout(function() {
            
            // this calculates the variables a b c ... for the required year
            whenIsEaster(i);

            var pitch = notes[Math.floor(((n - 3)*30 + p - 22) / ($scope.highPitch ? 2 : 4))]
            oscillator.frequency.value = pitch;

            $scope.playYear = i;
            $scope.playPitch = pitch;

            // this will update the whole graph.
            $scope.findDay(i);

            playSong(i + (Number($scope.jump) > 0 ? $scope.jump : 3));
        }, 250);
    }

    /**
     * Computes the algorithm and writes the globals. Does not return anything
     */
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

    /**
     * Notes in the scale of C (natural)
     */
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
        notes[15] = notes[14] * Math.pow(2, 1/12) * Math.pow(2, 1/12); // B
        notes[16] = notes[15] * Math.pow(2, 1/12);                     // C
    }();

    /**
     *   NOT USED. These are all notes including half tones
     */
    //  var defineNotes = function() {
    //     notes[0]  = 340; // A
    //     notes[1]  = notes[0]  * Math.pow(2, 1/12); // A#
    //     notes[2]  = notes[1]  * Math.pow(2, 1/12); // B
    //     notes[3]  = notes[2]  * Math.pow(2, 1/12); // C
    //     notes[4]  = notes[3]  * Math.pow(2, 1/12); // C#
    //     notes[5]  = notes[4]  * Math.pow(2, 1/12); // D
    //     notes[6]  = notes[5]  * Math.pow(2, 1/12); // D#
    //     notes[7]  = notes[6]  * Math.pow(2, 1/12); // E
    //     notes[8]  = notes[7]  * Math.pow(2, 1/12); // F
    //     notes[9]  = notes[8]  * Math.pow(2, 1/12); // F#
    //     notes[10] = notes[9]  * Math.pow(2, 1/12); // G
    //     notes[11] = notes[10] * Math.pow(2, 1/12); // G#
    //     notes[12] = notes[11] * Math.pow(2, 1/12); // A
    //     notes[13] = notes[12] * Math.pow(2, 1/12); // A#
    //     notes[14] = notes[13] * Math.pow(2, 1/12); // B
    //     notes[15] = notes[14] * Math.pow(2, 1/12); // C
    //     notes[16] = notes[15] * Math.pow(2, 1/12); // C#
    // }();


    (function init() {
        $scope.year = (new Date()).getFullYear();
        var e = $timeout($scope.findDay, 300);
    })()

}]);