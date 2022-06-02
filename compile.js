const fs = require("fs")

var infile = String(fs.readFileSync(process.argv[2])).replace(/\t/g, '');

//infile = infile.split(/[\s\n,]+/)
infile = infile.split("\n")
infile = infile.map(x => x.split(" "))

for (var lineNo = 0; lineNo < infile.length; lineNo++) {
    var line = infile[lineNo]
    for (var itemNo = 0; itemNo < line.length; itemNo++) {
        var item = line[itemNo]
        var rindex = (amt) => line[itemNo + amt]
        //console.log(`${item}`, item.length, ".useproc".length)
        switch (item) {
            case "beginproc":
                infile[lineNo][itemNo] = "_shift_stack_right_"
                break
            case "endproc":
                infile[lineNo][itemNo] = "_shift_stack_left_; ret;"
                break
            case "useproc":
                var params = line.slice(2)
                var appendFile = []
                var pushT = false
                params.forEach(x => {
                    if (x.at(-1) == ",") {
                        x = x.slice(0, -1)
                    }
                    if (x[0] == "&") {
                        appendFile.push(`lea %edx, ${x.slice(1)}`)
                        x = "%edx"
                        pushT = true
                    }
                    appendFile.push(`push ${x}`)

                })

                appendFile.push(`_shift_stack_left_`, `call ${line[1].at(-1) == "," ? line[1].slice(0, -1) : line[1]}`, `_shift_stack_right_`)
                if (pushT) {
                    //console.log("call")
                    appendFile.unshift("push %edx")
                    appendFile.push("pop %edx")
                }
                infile.splice(lineNo, 1, ...appendFile.map(x => x.split(" ")))
                //console.log(infile)
                lineNo += appendFile.length - 1
                break
            case "evaluate":
                var returnReg = line[1]
                var scanPos = 3
                var appendFile = []
                appendFile.push(`push %eax; push %ebx`, `mov %eax, ${line[2]}`)
                while (scanPos < line.length - 1) {
                    var sitem = {
                        current: line[scanPos],
                        previous: line[scanPos - 1],//parseInt(code[itemNum - 1]) ? code[itemNum - 1] : `[${code[itemNum - 1]}]`,
                        next: line[scanPos + 1]//parseInt(code[itemNum + 1]) ? code[itemNum + 1] : `[${code[itemNum + 1]}]`
                    }
                    console.log("$$$$$$$", sitem)
                    appendFile.push(...((inD) => {
                        switch (inD.current) {
                            case "+":
                                return [`add %eax, ${inD.next}`]
                            case "-":
                                return [`sub %eax, ${inD.next}`]
                            case "*":
                                return [
                                    `push %ebx`,
                                    `mov %ebx, ${inD.next}`,
                                    `mul %ebx`,
                                    `pop %ebx`
                                ]
                            case "/":
                                return [
                                    `push %ebx`,
                                    `mov %ebx, ${inD.next}`,
                                    `div %ebx`,
                                    `pop %ebx`
                                ]
                            case "%":
                                return [
                                    `push %ebx`,
                                    `push %edx`,
                                    `mov %ebx, ${inD.next}`,
                                    `div %ebx`,
                                    `mov %eax, %edx`,
                                    `pop %edx`,
                                    `pop %ebx`
                                ]
                            case "|":
                                return [
                                    `push %ebx`,
                                    `mov %ebx, ${inD.next}`,
                                    `or %eax, %ebx`,
                                    `pop %ebx`,
                                ]
                            case "&":
                                return [
                                    `push %ebx`,
                                    `mov %ebx, ${inD.next}`,
                                    `and %eax, %ebx`,
                                    `pop %ebx`,
                                ]
                            case "<<":
                                return [
                                    `push %ecx`,
                                    `mov %cl, ${inD.next}`,
                                    `shl %eax, %cl`,
                                    `pop %ecx`,
                                ]
                            case ">>":
                                return [
                                    `push %ecx`,
                                    `mov %cl, ${inD.next}`,
                                    `shr %eax, %cl`,
                                    `pop %ecx`,
                                ]
                            default:
                                console.log("COMPILE ERROR", inD)
                                return []
                        }
                    })(sitem))
                    scanPos += 2;
                }
                console.log(appendFile)
                appendFile.push(`mov ${returnReg} %eax`, `pop %ebx; pop %eax`)
                infile.splice(lineNo, 1, ...appendFile.map(x => x.split(" ")))
                lineNo += appendFile.length - 1
            //text_section.push(`mov _mathResult, %eax`, `pop %eax\n`)
            ///line[itemNo] = { phrase: "_mathResult", type: "assigned" }
            //line.splice(itemNo + 1, scanPos - itemNo)
        }
    }
}

console.log("successful")
fs.writeFileSync(process.argv[3], infile.map(x => x.join(" ")).join("\n"))
