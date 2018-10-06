GOCMD=go
GOBUILD=$(GOCMD) build
BINARY_NAME=cs50
BINARY_UNIX=$(BINARY_NAME)_unix

all: build

build:
	$(GOBUILD) -o $(BINARY_NAME) -v

.PHONY: run clean
run:
	./$(BINARY_NAME)

clean:
	rm -rf $(BINARY_NAME) $(BINARY_UNIX)