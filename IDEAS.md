# Ideas

I had come to CS50 without any knowledge of C so I wanted to use my final as an opportunity to explore my new understanding of the language. I had a couple of ideas:

## Sentiment Analysis

- [C Bindings in NodeJS](https://medium.com/@tarkus/how-to-call-c-c-code-from-node-js-86a773033892)
- [Trump Sentiment Tracker](https://hackernoon.com/how-i-built-trump-sentiment-tracker-355ff87859f9)
- [Sentiment Analysis in Python](https://github.com/cjhutto/vaderSentiment)
- [Google's Explanation of ML on Text Analysis](https://developers.google.com/machine-learning/guides/text-classification/)
- [Top 5 Emotional / Sentiment Analysis APIs](https://medium.com/@sifium/top-five-emotional-sentiment-analysis-apis-116cd8d42055)
- [C Performance in NodeJS ~ Google Engineer @fhinkel](https://fhinkel.rocks/2017/12/07/Speed-up-Your-Node-js-App-with-Native-Addons/)
- [Trump2Cash - Trump Tweets Trader Bot](https://github.com/maxbbraun/trump2cash)

## C app accessible to the web

- [C Bindings in NodeJS](https://medium.com/@tarkus/how-to-call-c-c-code-from-node-js-86a773033892)
- [C Performance in NodeJS ~ Google Engineer @fhinkel](https://fhinkel.rocks/2017/12/07/Speed-up-Your-Node-js-App-with-Native-Addons/)

## Machine Learning Password Brute Force

Kind of pointless since the passwords are hashed and I don't think it's worthwhile trying to gleam some relationship between a hash input and output. These algorithms are designed to obfuscate and be discrete, eg. abc should give a completely different hash to abd.

- [Encryption algorithm optimization](https://crypto.stackexchange.com/questions/51941/cryptography-algorithms-that-take-longer-to-solve-on-a-gpu-than-a-cpu)
- [Building a Neural Network in Python](https://towardsdatascience.com/how-to-build-your-own-neural-network-from-scratch-in-python-68998a08e4f6)

## Word Generator

- Goal
  - Generate words which look like English
  - take as input a character length
  - we don't want to allow it to match 100% so we should disregard input where Ef(x) = 0
  - we should encourage successive character matches: distance is 0 for multiple characters in a row
- Error function
  - average of distance of each letter in each word in dict.
  - eg. a -> bat, a = 1, b = 2: (b - a) + (a - 0) + (t - 0);
- Prediction
  - we should words which are close to English
  - we should see interesting patterns which show up in English

## Database

I enjoyed optimizing data lookups using specific hash functions and data structures. This is something abstracted away in languages like JavaScript so I rarely get my hands dirty in this kind of problem at work. I found the speller pset incredibly interesting and would like to explore this problem space more.

- Goal
  - Setup a database which can be queried using SQL syntax
  - syntax parser can be error sensitive (ie. strict spaces)
  - database will be created and destroyed during each session
  - support select by string
  - allows for implementation of C bindings to NodeJS
  - can implement web based UI


## Fibonacci Series

- Performance of C++
- Real time benchmark