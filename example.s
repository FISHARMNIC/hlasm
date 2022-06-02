strcpy: beginproc
	pop %ebx
	pop %eax
	proc_loop:
		mov [%eax], %eax
		inc %eax
		inc %ebx
		cmpb [%eax], 0
		jne proc_loop
endproc

main:
	useproc strcpy, &str1, &str2
	evaluate %eax, 1 + 2 * 3 / 4
	ret