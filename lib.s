_stack_d1_: .long 0
_stack_d2_: .long 0

.macro proc_init
mov %eax, %esp
sub %eax, 100
mov _stack_d2_, %eax
.endm

.macro _shift_stack_left_
    mov _stack_d1_, %esp # duplicate the current pos
    mov %esp, _stack_d2_ # duplicate the stack frame
.endm


.macro _shift_stack_right_
    mov _stack_d2_, %esp # duplicate the current pos
    mov %esp, _stack_d1_ # go back to the original base
.endm

.macro beginproc
    _shift_stack_right_
.endm

.macro endproc
    _shift_stack_left_
.endm

.macro param p
    pop \p
.endm