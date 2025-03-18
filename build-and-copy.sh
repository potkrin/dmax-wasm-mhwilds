#!/bin/bash

# 実行方法: ./build-and-copy.sh or bash build-and-copy.sh
# sh build-and-copy.sh で実行すると dash 等が選択される可能性があるため bash を明示的に指定

# エラー時にスクリプトを停止
set -e

# パスを変数として定義
REACT_BUILD_DIR=./build
DJANGO_STATIC_DIR=~/work/mhr-speedrun/dmax/static/dmax
DJANGO_TEMPLATES_DIR=~/work/mhr-speedrun/dmax/templates/dmax

# ビルド
PUBLIC_URL=/static/dmax npm run build

# ディレクトリの存在確認
if [ ! -d "$DJANGO_STATIC_DIR" ] || [ ! -d "$DJANGO_TEMPLATES_DIR" ]; then
    echo -e "\033[31mError: Django directories do not exist.\033[0m" 1>&2
    exit 1
fi

# 旧ファイルの削除
rm -rf "$DJANGO_STATIC_DIR/static/css/*"
rm -rf "$DJANGO_STATIC_DIR/static/js/*"

# ファイルコピー
cp -r "$REACT_BUILD_DIR"/* "$DJANGO_STATIC_DIR"/

# index.html を templates に配置
cp "$REACT_BUILD_DIR"/index.html "$DJANGO_TEMPLATES_DIR"/

# 不要な index.html を削除
rm "$DJANGO_STATIC_DIR"/index.html
