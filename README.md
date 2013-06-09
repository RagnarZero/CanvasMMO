# CanvasMMO

This is our new browser-based online game

### Installation
To install all needed dependencies just run ``` npm install ``` inside the cloned directory.
To start the server run ``` node game-node.js ```


### Testing
Install ```jasmine-node``` globally or run 
  npm --dev install
Then add module bins to the path variable like this:
  PATH=$PATH:$(pwd)/node_modules/.bin 
inside the project directory. To run the tests:
  jasmine-node --coffee spec

### Authors

* Janek Ilgner _( RagnarZero )_
* Thomas Ganser _( eThomerce )_
* Julian Hespenheide _( ndsh )_
