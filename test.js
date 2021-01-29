const binary64 = function(mantissaInput, exponent) {
    let input = mantissaInput.trim();

    let signBit;
    let mantissa;
    if (input[0] === '-') {
        mantissa = input.slice(1, input.length);
        signBit = 1;
    } else if (input[0] === '0' || input[0] === '1') {
        mantissa = input;
        signBit = 0
    } else {
        throw new Error('Invalid input!');
    }
    signBit = String(signBit);

    if (mantissa[0] !== '0' && mantissa[0] !== '1') {
        throw new Error('Invalid input!');
    }

    //zero check
    if (Number(mantissa) === 0) {
        exponent = '00000000000';
        let fractionPart = '0000000000000000000000000000000000000000000000000000';
        let hex = '0x0000000000000000';
        
        return {
            signBit: signBit,
            exponent: exponent,
            fractionPart: fractionPart,
            hex: hex
        }
    }

    let pointFlag = false; 
    for (let i = 0; i < mantissa.length; i++) {
        if (mantissa[i] !== '0' && mantissa[i] !== '1') {
            if (mantissa[i] !== '.') {
                throw new Error('Invalid input!');
            }

            if (pointFlag) {
                throw new Error('Invalid input!');
            }
            
            pointFlag = true;
        }
    }

    let addToExponent;
    let index1 = mantissa.indexOf('1');
    let indexDot = mantissa.indexOf('.') === -1 
        ? mantissa.length + 1     
        : mantissa.indexOf('.');

    if (index1 < indexDot) {
        addToExponent = indexDot - (index1 + 1);
    } else if (index1 > indexDot) {
        addToExponent = indexDot - index1;
    }
    exponent += addToExponent;
    exponent += 1023;
    
    //denormalized and inf check
    if (exponent < 1) {
        let paddingSize = Math.abs(exponent);
        if (paddingSize === 0) {
            paddingSize = 1;
        }

        let zeroes = '';
        for (let i = 0; i < paddingSize; i++) {
            zeroes = zeroes + '0';
        }

        mantissa = mantissa.replace('.', '');
        mantissa = zeroes + mantissa;

        let fractionSize = 52 - mantissa.length;
        let fractionPart = mantissa;
        for (let i = 0; i < fractionSize; i++) {
            fractionPart = fractionPart + '0';
        }
        
        exponent = '00000000000';
        let helper = signBit + exponent + fractionPart;
        let hex = parseInt(helper, 2).toString(16).toUpperCase();
        hex = '0x' + hex;

        return {
            signBit: signBit,
            exponent: exponent,
            fractionPart: fractionPart,
            hex: hex
        };
    }

    //inf check
    if (exponent > 2046) {
        exponent = '11111111111';
        let fractionPart = '0000000000000000000000000000000000000000000000000000';
        let helper = signBit + exponent + fractionPart;
        let hex = parseInt(helper, 2).toString(16).toUpperCase();
        hex = '0x' + hex;

        return {
            signBit: signBit,
            exponent: exponent,
            fractionPart: fractionPart,
            hex: hex
        }; 
    }

    exponent = decbin(exponent, 11);
    mantissa = mantissa.replace('.', '');
    mantissa = insert(mantissa, mantissa.indexOf('1') + 1, '.');
    let fractionPart = mantissa.split('.')[1];
    let fractionSize = 52 - fractionPart.length;
    for (let i = 0; i < fractionSize; i++) {
        fractionPart = fractionPart + '0';
    }

    let helper = signBit + exponent + fractionPart;
    let hex = parseInt(helper, 2).toString(16).toUpperCase();
    hex = '0x' + hex;

    return {
        signBit: signBit,
        exponent: exponent,
        fractionPart: fractionPart,
        hex: hex
    }

}

function insert(str, index, value) {
    return str.substr(0, index) + value + str.substr(index);
}

function decbin(dec,length){
  var out = "";
  while(length--)
    out += (dec >> length ) & 1;    
  return out;  
}

binary64('-1.111', 9999);



