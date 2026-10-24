"""Strip AI co-author / generated-with trailers from a commit message (stdin -> stdout)."""
import re
import sys

text = sys.stdin.read()
patterns = [
    re.compile(r"^.*Co-Authored-By:.*$", re.IGNORECASE | re.MULTILINE),
    re.compile(r"^.*Co-authored-by:.*$", re.IGNORECASE | re.MULTILINE),
    re.compile(r"^.*Generated with.*$", re.IGNORECASE | re.MULTILINE),
    re.compile(r"^.*Codebuff.*$", re.IGNORECASE | re.MULTILINE),
    re.compile(r"^.*\U0001F916.*$", re.MULTILINE),
]
out = text
for p in patterns:
    out = p.sub("", out)
out = re.sub(r"\n{3,}", "\n\n", out).rstrip() + "\n"
sys.stdout.write(out)
