
export function math(leftValue, operator, rightValue, options) {
    leftValue = parseFloat(leftValue);
    rightValue = parseFloat(rightValue);

    return {
        "+": leftValue + rightValue,
        "-": leftValue - rightValue,
        "*": leftValue * rightValue,
        "/": leftValue / rightValue,
        "%": leftValue % rightValue
    }[operator];
}

export default math;
