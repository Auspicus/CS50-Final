#include <node.h>
#include <ctime>

using v8::Function;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Null;
using v8::Object;
using v8::String;
using v8::Value;
using v8::Number;

void RunCallback(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Function> cb = Local<Function>::Cast(args[0]);

  int fib1 = 0;
  int fib2 = 1;
  int fib3 = 2;

  double before = std::clock() / CLOCKS_PER_SEC;
  while (fib1 + fib2 < INT_MAX)
  {
    fib3 = fib1 + fib2;
    fib1 = fib2;
    fib2 = fib3;
  }
  double after = std::clock() / CLOCKS_PER_SEC;

  Local<Value> argv[1] = { Number::New(isolate, after - before) };
  cb->Call(Null(isolate), 1, argv);
}

void Init(Local<Object> exports, Local<Object> module) {
  NODE_SET_METHOD(module, "exports", RunCallback);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

/**
 * main.cc
 * 
 * Created by:
 *   - David Disch
 *     - Twitter: @auspicus
 *     - GitHub: @auspicus
 */