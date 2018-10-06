"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objToArr = (obj) => {
    let arr = [];
    for (let prop in obj)
        arr.push(obj[prop]);
    return arr;
};
exports.default = { objToArr };
