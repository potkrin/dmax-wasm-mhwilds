importScripts("./brachistochrone.js");

function supportsNestedWebWorkers() {
  try {
    var blob = new Blob(
      [
        "var worker = new Worker(URL.createObjectURL(new Blob(['self.postMessage(1);'], {type: 'text/javascript'}))); worker.onmessage = function(e) { self.postMessage(e.data); }",
      ],
      { type: "text/javascript" }
    );

    var url = URL.createObjectURL(blob);
    var worker = new Worker(url);

    worker.onmessage = function (e) {
      worker.terminate();
      URL.revokeObjectURL(url);
      if (e.data === 1) {
        console.log("Nested Web Workers are supported");
      } else {
        console.log("Nested Web Workers are not supported");
      }
    };

    worker.onerror = function () {
      worker.terminate();
      URL.revokeObjectURL(url);
      console.log("Nested Web Workers are not supported");
    };
  } catch (e) {
    console.log("Nested Web Workers are not supported");
  }
}

supportsNestedWebWorkers();

// この判定がないと DMAXのwasmバイナリ内でマルチスレッドが実行できない (webworkerへのメッセージをインターセプトしてしまう)
if (self.name === "startWasmWorker") {
  // var Module = typeof Module != "undefined" ? Module : {};
  self.onmessage = function (e) {
    console.log("Worker: Recieved Message", e.data[0], e.data[1], e.data[2], e.data[3]);
    this.postMessage("Hello from worker");

    const pmessage = this.postMessage;

    FS.writeFile("file.nl", e.data[3]["nl"]);
    FS.writeFile("file.row", e.data[3]["row"]);
    FS.writeFile("file.col", e.data[3]["col"]);

    if (Module.calledRun) {
      // ランタイムがすでに初期化されている場合、関数を直接呼び出す
      //var result = Module.wcall("wasm_main", "dmax_problem_light.nl", 1);
      let js_wrapped_main = Module.cwrap("wasm_main", "number", ["string", "number"]);
      let result = js_wrapped_main(e.data[0], e.data[1], e.data[2]);
      self.postMessage("message from worker main: " + result);
    } else {
      // まだランタイムが初期化されていない場合、onRuntimeInitializedを待つ
      Module.onRuntimeInitialized = function () {
        Module["print"] = (function () {
          // var element = document.getElementById("output");
          // if (element) element.value = ""; // clear browser cache
          return function (text) {
            if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(" ");
            // These replacements are necessary if you render to raw HTML
            //text = text.replace(/&/g, "&amp;");
            //text = text.replace(/</g, "&lt;");
            //text = text.replace(/>/g, "&gt;");
            //text = text.replace('\n', '<br>', 'g');
            console.log(text);
            // self.postMessage("from worker: " + text);
            pmessage(text);
            // if (element) {
            //     element.value += text + "\n";
            //     element.scrollTop = element.scrollHeight; // focus on bottom
            // }
          };
        })();
        /* to set Module["print"] to out, redifine here
         * out is related with stdout on C/C++
         */
        out = Module["print"] || defaultPrint;

        let js_wrapped_main = Module.cwrap("wasm_main", "number", ["string", "number", "number"]);
        // let result = js_wrapped_main(e.data[0], e.data[1]);
        let result = js_wrapped_main(e.data[0], e.data[1], e.data[2]);

        // self.postMessage("message from worker main: " + result);

        // result = arg_module.wcall("wasm_main", "dmax_problem_light.nl", 1);
        // self.onmessage = function (event) {
        //   var result = Module.wcall("wasm_main", "dmax_problem_light.nl", 1);
        //   self.postMessage(result);
        // };
      };
    }

    //   Module["print"] = (function () {
    //     //var element = document.getelementbyid("output");
    //     //if (element) element.value = ""; // clear browser cache
    //     return function (text) {
    //       if (arguments.length > 1)
    //         text = array.prototype.slice.call(arguments).join(" ");
    //       // these replacements are necessary if you render to raw html
    //       //text = text.replace(/&/g, "&amp;");
    //       //text = text.replace(/</g, "&lt;");
    //       //text = text.replace(/>/g, "&gt;");
    //       //text = text.replace('\n', '<br>', 'g');
    //       console.log(text);
    //       this.postMessage("output from worker: " + text);
    //       //   if (element) {
    //       //     element.value += text + "\n";
    //       //     element.scrolltop = element.scrollheight; // focus on bottom
    //       //   }
    //     };
    //   })();

    /* to set module["print"] to out, redifine here
     * out is related with stdout on c/c++
     */
    //   out = Module["print"] || defaultprint;

    //   this.wasm_main("dmax_problem_light.nl", 1);
    //   Module["wasm_main_func"]("dmax_problem_light.nl", 1);

    //  out("testmessage");

    // let js_wrapped_main = Module.cwrap("main", "number");
    // //   let js_wrapped_wasm_main = Module.cwrap("wasm_main", "number", [
    // //     "string",
    // //     "number",
    // //   ]);
    // console.log("main(): ", js_wrapped_main());

    // // let arg_threadnum = document.getElementById("threadnum").value;
    // // let arg_problem = document.getElementById("problem-select").value;
    // // console.log("problem: " + arg_problem);
    // // console.log("number of threads: " + arg_threadnum);

    // console.log(
    //   "The result wasm_main() is: ",
    //   js_wrapped_wasm_main("dmax_problem.nl", 1)
    // );
  };

  self.onerror = function (e) {
    console.error(`Error: ${e.message}`);
    console.error(`At ${e.filename}:${e.lineno}:${e.colno}`);
  };

  self.onmessageerror = function (e) {
    console.error(`Message error: ${e.message}`);
  };
}
