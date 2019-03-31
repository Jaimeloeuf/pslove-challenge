'use strict'; // Enforce use of strict verion of JavaScript

const { print } = require('./utils');

// Factory function for fifo objects
function FIFO(handler) {
    // Create a request_list variable that will be private once the function ends, but accessible via closure of this function
    let request_list = ['hello', 'world'];
    // Attach a new property to the request_list that binds the shift method
    request_list.get = request_list.shift;

    /* The main reason for using factory functions if to use closures to encapsulate data */


    function append(request) {
        request_list.push(request);

        // If the request appended is the only one in the list, then start the service
        // From empty list to now not empty

        // if (request_list.length === 1)
        if (request_list.length > 0)
            handler(request_list);

        return request_list.length;
    }

    // return this;
    return Object.freeze({
        // Get method returns the first request in the request_list
        get: () => request_list.shift(),
        // Append method adds the request to the end of the request_list
        append
    });
}

function p() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 100);
    })
}

function handler(request_list) {
    while (request_list.length) {
        // print('tp')
        // p();
        setTimeout((val) => {
            print(val)
        }, 1000, request_list.get());


        // Solve this problem by using the sync version, non-callback version of nodemailer
    }
}

const fifo = FIFO(handler);
// print(fifo.get());
// print(fifo.get());
print(fifo.append('hello'))


// Methods that I want
/*
    .get()
        To get the next/first request out from the Queue to process
    .append()
        Append a request to the end of the queue
    .size()
        To get the size of the queue
    .notEmpty()
        To pass in a callback function to run when the object is not empty
*/