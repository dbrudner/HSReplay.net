#!/bin/bash

set -e

BASEDIR="$(readlink -f $(dirname $0))/.."
STATICDIR="$BASEDIR/hsreplaynet/static/vendor"

rm -rf "$STATICDIR"
mkdir -p "$STATICDIR"


# Bootstrap

VERSION="3.3.6"
PKGNAME="bootstrap-$VERSION-dist"
SOURCE="https://github.com/twbs/bootstrap/releases/download/v$VERSION/$PKGNAME.zip"
OUTDIR="$STATICDIR/bootstrap"
ZIPFILE="$OUTDIR/bootstrap.zip"

mkdir -p "$OUTDIR"
wget "$SOURCE" -O "$ZIPFILE"
unzip "$ZIPFILE" -d "$OUTDIR"
mv "$OUTDIR/$PKGNAME"/{css,js,fonts} "$OUTDIR"
rmdir "$OUTDIR/$PKGNAME"
rm "$ZIPFILE"


# jQuery

PKGNAME="jquery"
VERSION="1.12.4"
SOURCE="https://code.jquery.com/$PKGNAME-$VERSION.min.js"
OUTFILE="$STATICDIR/$PKGNAME.min.js"

wget "$SOURCE" -O "$OUTFILE"


# React

VERSION="15.2.1"
BASEURL="https://cdnjs.cloudflare.com/ajax/libs/react/$VERSION"

OUTFILE="$STATICDIR/react.min.js"
SOURCE="$BASEURL/react.min.js"
wget "$SOURCE" -O "$OUTFILE"

OUTFILE="$STATICDIR/react-dom.min.js"
SOURCE="$BASEURL/react-dom.min.js"
wget "$SOURCE" -O "$OUTFILE"


# Raven

PKGNAME="raven"
VERSION="3.2.1"
SOURCE="https://cdn.ravenjs.com/$VERSION/$PKGNAME.min.js"
OUTFILE="$STATICDIR/$PKGNAME.min.js"

wget "$SOURCE" -O "$OUTFILE"


# Clipboard.js

PKGNAME="clipboard"
VERSION="1.5.12"
SOURCE="https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/$VERSION/$PKGNAME.min.js"
OUTFILE="$STATICDIR/$PKGNAME.min.js"

wget "$SOURCE" -O "$OUTFILE"
