#!/bin/bash
# 
# Add the filenames and their paths listed in a different file called - file_list.txt 
# Format:
#   /path/to/the/file/code.sh
#   /path/to/the/file/sub/test.py

if [ $# -ne 1 ]; then
    echo "Usage: $0 <base_filename>"
    exit 1
fi

base_filename="$1"
output_filename="${base_filename}.txt"
version=1

# Function to generate the next versioned filename
function generate_versioned_filename {
    if [ "$version" -eq 1 ]; then
        echo "${output_filename}"
    else
        echo "${output_filename%.*}v${version}.${output_filename##*.}"
    fi
}

# Function to increment the version
function increment_version {
    versioned_output_filename=$(generate_versioned_filename)
    
    while [ -f "$versioned_output_filename" ]; do
        ((version++))
        versioned_output_filename=$(generate_versioned_filename)
    done
}

# Read file paths from file_list.txt
files_to_process=$(cat file_list.txt)

# Create or append to the versioned output file
function create_or_append_output_file {
    if [ ! -f "${versioned_output_filename}" ]; then
        touch "${versioned_output_filename}"
    fi
    
    for file in $files_to_process; do
        if [ -f "$file" ]; then
            echo "Adding $file's content to ${versioned_output_filename}"
            cat "$file" >> "${versioned_output_filename}"
            echo "" >> "${versioned_output_filename}"
        fi
    done
}

increment_version
create_or_append_output_file

echo "The ${output_filename} has been versioned as ${versioned_output_filename}"
echo "The entire content of ${versioned_output_filename} is copied into the clipboard"
cat "${versioned_output_filename}" | pbcopy
