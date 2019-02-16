;(function(window) {

    function getRandomInt(max, min = 0) {
        return Math.floor(Math.random() * Math.floor(max)) + min;
      }

    function substrAndToInt(string, index = 0, length = 3, base = 16) {
        return parseInt(unmix(string.substr(index, length)), base);
    }

    function pad(string, length = 6, char = '0') {
        return (string.length < length ? char.repeat(length - string.length) + string : string);
    }

    function mix(string) {
        let firstSeg = Math.floor(string.length / 2);

        return pad(getRandomInt(26, 1) + '', 2) 
                + string.substr(0, firstSeg) 
                + pad(getRandomInt(26, 1) + '', 2) 
                + string.substr(firstSeg, string.length - firstSeg) 
                + pad(getRandomInt(26, 1) + '', 2);
    }

    function unmix(string) {
        let originalLength = string.length - 6;
        let firstSeg = Math.floor(originalLength / 2);

        return string.substr(2, firstSeg) + string.substr(firstSeg + 4, originalLength - firstSeg);
    }

    window.encryptEmail = function (input, secret, seg = 3) {
        if (!input) {
            throw Error('Missing input');
        }

        if (!secret) {
            throw Error('Missing secret');
        }

        try {
            let decSeg = parseInt('f'.repeat(seg), 16);

            let time = Math.round(decSeg * Math.random());

            let key = secret.split('').reduce((res, cur) => {
                return res * 10 + cur.charCodeAt(0);
            }, 10);

            key %= decSeg;

            base = key ^ time;

            let time16 = time.toString(16);
            
            let output = mix(pad(time16, seg));


            input.trim().split('').forEach(c => {
                output += '' + mix(pad((c.charCodeAt(0) ^ base).toString(16), seg));
            });

            return output;
        } catch (e) {
            console.error(e);
            throw Error('An error occurred');
        }
    };

    window.decryptEmail = function (encrypted, secret, seg = 3) {
        if (!encrypted) {
            throw Error('Missing encrypted input');
        }

        if (!secret) {
            throw Error('Missing secret');
        }

        try {
            let decSeg = parseInt('f'.repeat(seg), 16);

            seg += 6;

            let key = secret.split('').reduce((res, cur) => {
                return res * 10 + cur.charCodeAt(0);
            }, 10);

            key %= decSeg;

            let time = substrAndToInt(encrypted, 0, seg);

            let base = key ^ time;

            let result = '';

            for (let i = seg; i < encrypted.length; i += seg) {
                result += String.fromCharCode(substrAndToInt(encrypted, i, seg) ^ base);
            }

            return result;
        } catch (e) {
            console.error(e);
            throw Error('An error occurred');
        }
    }
})(window);