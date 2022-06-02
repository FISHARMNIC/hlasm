# HLASM - A small precompiler that extends assembly

### How To
compile using `node compile.js example.s out.s`  

### Features
* Creating procedures
  * To create a function/procedure begin with `label: beginproc` and end with `endproc`
  * Read parameters using `pop`
* Executing procedures
  * `useproc name, ...params`
  * If you are passing strings, use a `&` at the beginning of corresponding parameters
* Math
  * `evaluate result, expression`
  * ex. `evaluate %edx, 1 + 2 * 3`
  * Note: there is no order of operations nor parenthesis
  * Note: do not store into `eax` nor `ebx` since they get restored
