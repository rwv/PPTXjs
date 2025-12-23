#!/bin/bash
# Remove unused @ts-expect-error directives reported by TypeScript

# Get all files and line numbers with unused directives
pnpm type-check 2>&1 | grep "TS2578" | while read -r line; do
  # Extract file path and line number
  # Format: src/js/file.ts(123,45): error TS2578: ...
  file=$(echo "$line" | sed 's/(.*//')
  linenum=$(echo "$line" | sed 's/.*(\([0-9]*\),.*/\1/')

  if [ -f "$file" ]; then
    echo "Removing @ts-expect-error from $file:$linenum"
    # Use sed to delete the specific line
    sed -i.bak "${linenum}d" "$file"
    # Remove backup file
    rm -f "$file.bak"
  fi
done

echo "Done! Removed all unused @ts-expect-error directives."
