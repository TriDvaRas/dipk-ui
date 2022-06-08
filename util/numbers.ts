export function isNumber(value: any) {
    return typeof value === 'number' && isFinite(value);
}

export function genCC(a: number, b: number, c: number, cc?: number[][][]) {
    let CC = []
    for (let i = 0; i < c; i++) {
        let CCc: number[][] = []
        for (let j = 0; j < b; j++) {
            let CCb: number[] = []
            for (let k = 0; k < a; k++) {
                CCb.push((((cc || [])[i] || [])[j] || [])[k] || 0)
            }
            CCc.push(CCb)
        }
        CC.push(CCc)
    }
    return CC
}