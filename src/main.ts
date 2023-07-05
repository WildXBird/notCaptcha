import CryptoJSW from '@originjs/crypto-js-wasm';


const init = async () => {
    await CryptoJSW.SHA3.loadWasm();
    console.log("loadWasm", "done")

}
const calc = async (str: string) => {
    const rstHASH = CryptoJSW.SHA3(str).toString();
    return rstHASH
}

type POWResult = {
    done: false;
    takes: number;
    total: number;
    speed: string;
} | {
    done: true;
    takes: number;
    total: number;
    speed: string;
    result: string;
    key: string;

}
export const resolvePOW = async (afterFix: string, answer: string, hideMessage?: boolean, timeout?: number):Promise<POWResult> => {
    const complexity = parseInt(answer, 16)
    console.log("complexity:", complexity)

    const standAnswer = answer.toLowerCase()
    await init()
    const startTime = new Date().valueOf()
    let x = Math.floor(Math.random() * 1000000000)
    let count = 0
    let gap = new Date().valueOf()

    while (count < 10000000 && (new Date().valueOf() - startTime < (timeout || 120_000))) {
        const key = `${afterFix}-${x}`
        const result = await calc(key)
        if (result.startsWith(standAnswer)) {
            const takes = new Date().valueOf() - startTime
            console.log("takes:", takes / 1000, "total:", count, "speed:", (count / takes * 1000).toFixed(0), "hash/s", "x:", x)
            return {
                done: true,
                result,
                key,
                takes: takes / 1000,
                total: count,
                speed: (count / takes * 1000).toFixed(0)
            }
        }
        if (!hideMessage) {
            const time = new Date().valueOf()
            if (time - gap > 1000) {
                const takes = new Date().valueOf() - startTime
                console.log("takes:", takes / 1000, "total:", count, "speed:", (count / takes * 1000).toFixed(0), "hash/s", "x:", x)
                gap = time
            }
        }
        x = x + 1
        count = count + 1
    }

    const takes = new Date().valueOf() - startTime
    return {
        done: false,
        takes: takes / 1000,
        total: count,
        speed: (count / takes * 1000).toFixed(0)
    }
}

// (async () => {
//     const result = await resolve("abs", "10000")
//     console.log("!result", result)
// })()


// setTimeout(() => {

// }, 10_000)