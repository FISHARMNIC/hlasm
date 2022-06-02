.section .data
.include "lib.s"

calculation: .int 0

.section .text

strcpy: beginproc
	pop %ebx
	pop %eax
	strcpy_l:
        mov %cl, [%ebx]
		mov [%eax], %cl
		inc %eax
		inc %ebx
		cmpb [%ebx], 0
		jne strcpy_l
endproc

main: initproc
	useproc strcpy, &str1, &str2
	evaluate calculation, 5 * 2 + 3
	ret
