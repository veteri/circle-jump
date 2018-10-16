
let methodHolder = {


    submitTimeSource: function() {
        let self = this;

        return new Promise(function(resolve, reject) {

            let xhr = new XMLHttpRequest();

            let time = self.getPassedTime();

            //Add additional xhr parameters for confusion
            let a, b, c, d;

            /**
             * This will be the amount of bits that we shift the
             * time to the left. If this is 2 we left shift the time
             * 2 bits.
             * @type {Number}
             */
            a    = parseInt(Math.random() * 3 + 1);

            /**
             * This is the index for the summand, that you can find
             * one line below in a 3 element array. The element will
             * be added after we left shifted the time.
             * @type {Number}
             */
            b    = parseInt(Math.random() * 3);

            /**
             * This is the actual summand, chosen by the above index
             * @type {number}
             */
            c    = [0xc79d8b, 0xc7a2c4, 0xc8419b][b];

            /**
             * We have the same array as above on the server but reversed.
             * So in order to get the index we have to subtract the index
             * from the length - 1.
             *
             * If b was 0 and the length is 3 - 1. That means on the server the
             * index is 2 because as we said the array is in reversed order.
             *
             * In this case:
             *
             * 0x02 << 15 is 65536 and 0xfffe is 65534, which results in 2.
             * So we end up with 2 - b just as we want.
             * At the end we add a random confusion offset that we will undo
             * server sided.
             *
             *
             * @type {number}
             */
            b    = ((0x02 << 15) - 0xfffe - b) + 0xc79d8b;

            /**
             * This might seem complicated but everything left from
             * (time << a) + c is 0 and so is everything to the right from it.
             * So everything that is left is actually (time << a) + c.
             * And as we said before a is the amount of left shifting and c is the
             * summand we add on top of that number.
             */
            time = ((0x2a01c0d7cc & 0x7f) - 0x4c) + (time << a) + c + ((0x29a << 15) - 0x14d0000);

            /**
             * This is important to validate the time being correct.
             * We just rightshift the time and add the offset to it.
             */
            d = (time << 3) + 0xc79d8b;

            /**
             * Add the offset to a as well.
             * a = left shift bits
             */
            a += 0xc79d8b;

            //Put everything in the requestbody
            let requestBody = "a=" + a + "&b=" + b + "&c=" + time + "&d=" + d;


            xhr.addEventListener("readystatechange", function() {
                if (this.readyState === 4) {

                    if (this.status === 200) {

                        let response = JSON.parse(this.responseText);

                        resolve({
                            rankings: response.rankings,
                            time: response.time
                        });

                    } else {
                        reject();
                    }

                    console.log(this.responseText);
                }
            });

            xhr.open("POST", "/map/submit-time", true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(requestBody);

        });
    },
};
