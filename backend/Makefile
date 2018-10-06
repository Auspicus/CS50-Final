GOCMD=go
GOBUILD=$(GOCMD) build
BINARY=cs50

.PHONY: all run
all: build run

build:
	$(GOBUILD) -o $(BINARY) -v

run:
	./$(BINARY)