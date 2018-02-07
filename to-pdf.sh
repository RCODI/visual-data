PATH_PDFS=$PWD/pdfs
cd "results"
for d in */ ; do
    d=${d%*/}
    cd $d
    echo "$d"
	for cMd in *.md ; do
		echo $d " :: " $cMd
		electron-pdf $cMd $PATH_PDFS/$d:$cMd.pdf -c $PATH_PDFS/assets/gh-markdown.css
	done
    cd ..
done
cd ..
