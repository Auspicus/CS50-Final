package main

import (
	"net/http"
	"log"
	"time"
	"encoding/json"
)

type FibonacciBenchmark struct {
	Time time.Duration `json:"nanoseconds"`
}

func fib() (time.Duration) {
	fib1 := 0
	fib2 := 1
	fib3 := 2
	l1 := 0
	max := 2^31 - 1

	before := time.Now()
	for l1 < 1000 * 1000 {
		for fib1 + fib2 < max {
			fib3 = fib1 + fib2
			fib1 = fib2
			fib2 = fib3
		}

		fib1 = 0
		fib2 = 1
		fib3 = 2
		l1 += 1
	}
	after := time.Now()

	return after.Sub(before)
}

func handler(w http.ResponseWriter, r *http.Request) {
	if (r.Method == "GET" && r.URL.Path[1:] == "calculate") {
		data := FibonacciBenchmark{fib()}
		bytes, err := json.Marshal(data)
		if err != nil {
			panic(err)
		}
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET")
		w.Header().Set("Access-Control-Allow-Headers", "content-type")
		w.Write(bytes)
	}
}

func main() {
	http.HandleFunc("/", handler)
	log.Fatal(http.ListenAndServe(":8080", nil))
}