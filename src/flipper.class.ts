export class Flipper {

  constructor() {

  }

  sayHi(hi="Hello World") {
    console.log(hi);
  }

  init() {
    console.group('%c Custom log:', 'background: #00A9A5; color: #00D5DB; font-size: 16px;')
    console.log("init")
    console.groupEnd()
    
  }
}
