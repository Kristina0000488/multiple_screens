/*const employees = [ 
    { employeeId: 11, name: 'John', managerId: 11 }, 
    { employeeId: 50, name: 'Todd', managerId: 73 }, 
    { mployeeId: 150, name: 'Alex', managerId: 200 }, 
    { employeeId: 73, name: 'Sara', managerId: 11 }, 
    { employeeId: 200, name: 'Alex', managerId: 50 }, 
    { employeeId: 100, name: 'Alex', managerId: 150 }, 
  ]; 

function setarr(arr, id) {
    const arr2 = [];

    
    function find(arr, id) {
        if (arr.length === 1) {                console.log(arr, id, 'ddd')
            arr2.push( arr[0].managerId );
    
            return;
        } else {
            const idx =  arr.findIndex( val => val.employeeId === id);
            if( idx !== -1) {
                arr2.push( arr[idx].managerId );
                const arr3 = JSON.parse(JSON.stringify(arr));
                console.log(arr, id)
                
                return find(arr3.filter(val => val.employeeId !== id) , arr[idx].managerId);
            }

            return [];
        }
    }
    
    find(arr, id);

    return arr2;

}
setarr (employees, 112)*/

const arr = [1,2,3,4,5];

console.log(arr.forEach(v => v * 10).filter(v => v >= 40).reduce((a, b) => a + b,0))

document.querySelectorAll('ul#parent li[data-color=blue]');

function i() {
    let c = 0;

    return function inner() {
        c++;

        return c;
    }
}
const w = [[1],[2,[3,[4]]]];
function x(arr) {
    const a = [];
    //console.log(arr)
    function z(ar) { console.log(ar)
        for (let i of ar) { console.log(ar[i])
            if (Array.isArray(ar[i])) {
                z(ar[i])
                //console.log(arr[i], 1)
            } else {
               // console.log(arr, 2)
                a.push(arr[i]);
            }
        }
    }

    z(arr);

    return a;
}

console.log(x(w))

function palindrome(str) {
    const x = str.split('').reverse().joint();

    if (x == str) return true;

    return false;
}

palindrome("kayak") //returns true
palindrome("love");

function map(arr, callback) {
    const aw = [];

    for (let i of arr) {
        aw.push(callback(arr[i]));
    }

    return aw;
}

map(array, callback)

document.getElementById('parent').addEventListener('click', (e) => e.target.nodeName === 'SPAN' ? print('clicked') : '')

const codes = ["en", "fr" ,"de", "ta"].forEach(v => obj['lang-' + v] = true );

const obj = {};

function memoize(func) {
    const obj = {};

    const id = Math.random();

    if (obj[func]) return obj[func]

    const res = func();
    obj[func] = res;

    function inner(...args) {
        const k = JSON.stringify(...args);

        if (k in obj) return obj[k];

        obj[k] = func.apply( this, args)

        return obj[k]
    }

    return inner;
}

const first = [1,2,3,4,5];
const second = [4,5];

(function(){
    first.filter(v => !second.includes(v));
})()

document.getElementById('submit').addEventListener('click', (e => {
    e.preventDefault();

    e.target.innerHTML = 'confirm';
}))

function once(func) {
    let count = 1;

    return function() {
        if (count > 1) return;
        count++;
        //const n = func.apply(this);

        return func();
    }
}

let test = () => console.log("entered test");
test  = once(test); //write the once function

test(); //prints "entered test"
test();