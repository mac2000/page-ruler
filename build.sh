#!/bin/bash

ZIP=false
if [ $# -eq 1 ] && [ "$1" = "zip" ]
then
    ZIP=true
fi

# remove existing build dir
echo "removing build"
rm -rf build/

# copy src as build
echo "copying src"
cp -r src/ build/

# move css file to base dir and remove css dir
echo "moving css"
cp build/css/content.css build/content.css
rm -rf build/css

# move options
echo "moving options"
cp build/options/* build/
rm -rf build/options

# build js and remove src

FORMATTING=""
if [ $ZIP != true ]
then
    FORMATTING="--formatting pretty_print"
fi

echo "compiling content.js"
find src/js/content/ -name "*.js" | xargs java -jar deps/compiler.jar --js_output_file build/content.js --compilation_level WHITESPACE_ONLY $FORMATTING --js

echo "compiling background.js"
find src/js/background/ -name "*.js" | xargs java -jar deps/compiler.jar --js_output_file build/background.js --compilation_level WHITESPACE_ONLY $FORMATTING --js

rm -rf build/js

if [ $ZIP = true ]
then
    echo "zipping package"
    zip -r pageruler.zip build
fi