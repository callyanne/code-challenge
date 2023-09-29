var sum_to_n_a = function(n) {
    // use mathematical formula
    return (n * (n + 1)) / 2;
};

var sum_to_n_b = function(n) {
    let result = 0;
    // brute force approach
    for (let i = 1; i <= n; i++) {
        result += i;
    }
    return result;
};

var sum_to_n_c = function(n) {
    let result = 0;
    let currNum = 1;
    while (currNum <= n) {
        result += currNum;
        currNum++;
    }
    return result;
};