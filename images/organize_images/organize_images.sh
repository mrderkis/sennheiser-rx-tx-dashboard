for file in *; do
    # Skip directories
    [ -d "$file" ] && continue
    
    # Extract the base name (remove extensions)
    base_name="${file%.*}"
    
    # Remove numeric suffixes like _1, _2, _3
    clean_name=$(echo "$base_name" | sed -E 's/_[0-9]+$//')
    
    # Create a directory for the clean name if it doesn't exist
    [ ! -d "$clean_name" ] && mkdir "$clean_name"
    
    # Move the file into the respective folder
    mv "$file" "$clean_name/"
done

