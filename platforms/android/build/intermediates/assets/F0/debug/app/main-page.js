/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

/*
NativeScript adheres to the CommonJS specification for dealing with
JavaScript modules. The CommonJS require() function is how you import
JavaScript modules defined in other files.
*/
const Observable = require("tns-core-modules/data/observable").Observable;
const dialogs = require("tns-core-modules/ui/dialogs");
const webViewModule = require("tns-core-modules/ui/web-view");



function onNavigatingTo(args) {
    const page = args.object;
    const vm = new Observable();
    vm.set("webViewSrc", "http://198.58.111.70:8084/");
    vm.set("result", "");
    vm.set("tftext", "https://docs.nativescript.org/");
    page.bindingContext = vm;

}



// handling WebView load finish event
function onWebViewLoaded(webargs) {
    const page = webargs.object.page;
    const vm = page.bindingContext;
    const webview = webargs.object;
    vm.set("result", "WebView is still loading...");

    webview.on(webViewModule.WebView.loadFinishedEvent, (args) => {
        let message = "";
        if (!args.error) {
            message = `WebView finished loading of ${args.url}`;
        } else {
            message = `Error loading ${args.url} : ${args.error}`;
        }

        vm.set("result", message);
        console.log(`WebView message - ${message}`);
    });
}
// going to the previous page if such is available
function goBack(args) {
    const page = args.object.page;
    const webview = page.getViewById("myWebView");
    if (webview.canGoBack) {
        webview.goBack();
    }
}
// changing WebView source
function submit(args) {
    const page = args.object.page;
    const vm = page.bindingContext;
    const textField = args.object;
    const text = textField.text;
    if (text.substring(0, 4) === "http") {
        vm.set("webViewSrc", text);
        textField.dismissSoftInput();
    } else {
        dialogs.alert("Please, add `http://` or `https://` in front of the URL string")
            .then(() => {
                console.log("Dialog closed!");
            });
    }
}
/*
Exporting a function in a NativeScript code-behind file makes it accessible
to the file’s corresponding XML file. In this case, exporting the onNavigatingTo
function here makes the navigatingTo="onNavigatingTo" binding in this page’s XML
file work.
*/
exports.onNavigatingTo = onNavigatingTo;
exports.onWebViewLoaded = onWebViewLoaded;
exports.submit = submit;
exports.goBack = goBack;