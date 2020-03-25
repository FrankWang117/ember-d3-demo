function flatDeep(arr: any[], d: number = 1): any[] {
    return d > 0 ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val, d - 1) : val), [])
        : arr.slice();
};
export  { flatDeep };
 // use
/**
flatDeep([1,2,3,[1,2,3,4, [2,3,4]]],Infinity)

*/