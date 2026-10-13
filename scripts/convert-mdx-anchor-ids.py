#!/usr/bin/env python3
"""Convert explicit MDX heading anchors from {#id} to {/* #id */}.

Usage:
    python scripts/convert-mdx-anchor-ids.py path/to/file.mdx
    python scripts/convert-mdx-anchor-ids.py path/to/folder

The script scans a single .mdx file or all .mdx files recursively underneath the given folder.
"""

import argparse
import pathlib
import re
import sys

HEADING_ANCHOR_RE = re.compile(r'^(?P<before>\s*#{1,6}\s.*?)(?:\s*\{\#(?P<id>[^}]+)\})\s*$')


def convert_line(line: str) -> str:
    match = HEADING_ANCHOR_RE.match(line)
    if not match:
        return line
    before = match.group("before")
    anchor_id = match.group("id")
    return before + " {/* #" + anchor_id + " */}\n"


def convert_file(path: pathlib.Path) -> bool:
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines(keepends=True)
    updated_lines = [convert_line(line) for line in lines]

    if updated_lines != lines:
        path.write_text("".join(updated_lines), encoding="utf-8")
        return True
    return False


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Convert MDX heading anchor ids from {#id} to {/* #id */} in .mdx files."
    )
    parser.add_argument(
        "path",
        type=pathlib.Path,
        help="Path to a .mdx file or folder to scan for .mdx files.",
    )
    args = parser.parse_args()

    if not args.path.exists():
        print(f"error: path does not exist: {args.path}", file=sys.stderr)
        return 1

    changed_files = []
    if args.path.is_file():
        if args.path.suffix.lower() != ".mdx":
            print(f"error: file must have a .mdx extension: {args.path}", file=sys.stderr)
            return 1
        if convert_file(args.path):
            changed_files.append(args.path)
    else:
        for path in sorted(args.path.rglob("*.mdx")):
            if convert_file(path):
                changed_files.append(path)

    if changed_files:
        print("Updated files:")
        for path in changed_files:
            print(f"- {path}")
    else:
        print("No files needed conversion.")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
