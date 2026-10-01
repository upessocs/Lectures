#!/bin/sh

#find ./ -name "*" -type d > list.txt
find ./ -maxdepth 1 -name "*" -type d >list.txt

filetypes="md,csv,pdf,ipynb,docx,pptx,xlsx,ods,odt,odp"
for filetype in $(echo $filetypes | sed "s/,/ /g")
do
    echo "Searching for $filetype files..."
    find ./*.$filetype -maxdepth 1 -name "*" >>list.txt
done

echo -e "\n"
cat list.txt
